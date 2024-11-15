const pgConnection = require("./secrets/dbConnections");

const getAccounts = async function () {
  const query = `
  SELECT * FROM public._account;
  `;
  try {
    const { rows } = await pgConnection.query(query);
    console.log("repository -> ", rows);

    return rows;
  } catch (err) {
    console.error("Error fetching footfall data", err);
  }
};

module.exports = { getAccounts };
