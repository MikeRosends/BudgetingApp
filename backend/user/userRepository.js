const pgConnection = require("../secrets/dbConnections");

const getUsers = async function () {
  const query = `
  SELECT * FROM public._user;
  `;
  try {
    const { rows } = await pgConnection.query(query);

    return rows;
  } catch (err) {
    console.error("Error fetching users", err);
  }
};

module.exports = { getUsers };
