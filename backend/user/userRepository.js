const pgConnection = require("../secrets/dbConnections");

const getUserByEmail = async function (user_email, user_password) {
  const query = `SELECT * FROM public._user_profiles WHERE user_email  = $1`;
  console.log("REPO -> ", user_email);

  try {
    const { rows } = await pgConnection.query(query, [user_email]);
    return rows[0];
  } catch (err) {
    console.error("Error fetching users:", err);
    throw new Error("Database query failed"); // Pass error to caller
  }
};

const insertNewUserProfile = async function (user_email, user_password) {
  const query = `INSERT INTO public._user_profiles (user_email, user_password) VALUES ($1, $2)`;
  try {
    const { rows } = await pgConnection.query(query, [
      user_email,
      user_password,
    ]);
    return rows;
  } catch (err) {
    console.error("Error inserting new user into database:", err);
    throw new Error("Database insert new user query failed");
  }
};

module.exports = { insertNewUserProfile, getUserByEmail };
