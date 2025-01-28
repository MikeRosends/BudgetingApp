require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { insertNewUserProfile, getUserByEmail } = require("./userRepository");

const app = express();
app.use(express.json());

const loadUsers = async function () {
  console.log("calling loadUsers");

  try {
    const data = await getUsers();
    console.log("from service -> ", data);

    return data;
  } catch (err) {
    console.error("Error loading users -> ", err);
  }
};

const userLogin = async function (user_email, user_password) {
  console.log("email from SERVICE -> ", user_email);
  console.log("password from SERVICE -> ", user_password);

  try {
    const data = await getUserByEmail(user_email);
    console.log("DAATAAA ->>>> ", data);

    const passwordMatch = await bcrypt.compare(
      user_password,
      data.user_password
    );

    passwordMatch ? console.log("MATCH") : console.log("NO MATCH");

    if (!passwordMatch) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { id: data.user_id, user_email: data.user_email },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    return token;
  } catch (err) {
    console.error("Error getting user by the given email", err);
  }
};

const insertUserInDB = async function (user_email, user_password) {
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
  insertUserInDB,
  userLogin,
};
