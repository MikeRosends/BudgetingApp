require("dotenv").config();
const express = require("express");
const {
  findAccountByName,
  getAccountsWithUserId,
} = require("./AccountRepository");

const app = express();
app.use(express.json());

const loadAccountsWithUserId = async function (user_id) {
  try {
    const data = await getAccountsWithUserId(user_id);
    return data;
  } catch (err) {
    console.error("Error loading account with user_id -> ", err);
  }
};

const loadAccountByName = async function (accountName, user_id) {
  try {
    const data = await findAccountByName(accountName, user_id);
    return data;
  } catch (err) {
    console.error("Error loading account by name -> ", err);
  }
};

module.exports = {
  loadAccountByName,
  loadAccountsWithUserId,
};
