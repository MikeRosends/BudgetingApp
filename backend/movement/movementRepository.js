const pgConnection = require("../secrets/dbConnections");

const getMovements = async function () {
  const query = `
  SELECT * FROM public.movement;
  `;
  try {
    const { rows } = await pgConnection.query(query);

    return rows;
  } catch (err) {
    console.error("Error fetching movements", err);
  }
};

module.exports = { getMovements };
