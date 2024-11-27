require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getUsers, insertNewUserProfile } = require("./userRepository");

const app = express();
app.use(express.json());

const loadUsers = async function () {
  try {
    const data = await getUsers();
    console.log("from service -> ", data);

    return data;
  } catch (err) {
    console.error("Error loading users -> ", err);
  }
};

const validateUserAndGenerateToken = async function (
  user_email,
  user_password
) {
  try {
    const users = await getUsers();
    const user = users.find((u) => u.user_email === user_email);

    if (!user) {
      throw new Error("User not found");
    }

    // Compare the hashed password
    const passwordMatch = await bcrypt.compare(
      user_password,
      user.user_password
    );
    if (!passwordMatch) {
      throw new Error("Invalid credentials");
    }

    // Generate the token, embedding the user_id and user_email
    const token = jwt.sign(
      { id: user.user_id, user_email: user.user_email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return token;
  } catch (err) {
    console.error("Error validating user", err);
    throw err; // Re-throw to pass the error to the caller
  }
};

const loadUserToDatabase = async function (user_email, user_password) {
  try {
    if (!user_email || !user_password) {
      throw new Error("Username and user_password are required");
    }

    // Hash the user_password
    const hashedPassword = await bcrypt.hash(user_password, 10);

    // Call the repository to insert the user
    const result = await insertNewUserProfile(user_email, hashedPassword);

    console.log("User successfully loaded into database");
    return result; // Optionally return the result for the controller
  } catch (err) {
    console.error("Error loading user into database -> ", err);
    throw err; // Re-throw the error to be handled by the controller
  }
};

module.exports = {
  loadUsers,
  validateUserAndGenerateToken,
  loadUserToDatabase,
};
