const pgConnection = require("../secrets/dbConnections");

const getAccountsWithUserId = async function (user_id) {
  try {
    let query = `
    SELECT * FROM _account WHERE user_id = $1
    `;
    const { rows } = await pgConnection.query(query, [user_id]);

    return rows;
  } catch (err) {
    console.error("Error fetching accounts", err);
  }
};

const getAccounts = async function (accountName, user_id) {
  try {
    let query = `
    SELECT * FROM public._account
    `;
    const { rows } = await pgConnection.query(query);

    return rows;
  } catch (err) {
    console.error("Error fetching accounts with user_id", err);
  }
};

const findAccountByName = async function (accountName, user_id) {
  try {
    let query = `
    SELECT account_id, account_creation_date, account_name, amount, user_id
    FROM public._account
    WHERE account_name = $1 AND user_id = $2;
    `;
    const { rows } = await pgConnection.query(query, [accountName, user_id]);

    return rows;
  } catch (err) {
    console.error("Error fetching account by name", err);
  }
};

module.exports = { getAccounts, findAccountByName, getAccountsWithUserId };
