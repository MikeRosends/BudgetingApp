require("dotenv").config();
const express = require("express");
const {
  getAccounts,
  findAccountByName,
  getAccountsWithUserId,
} = require("./AccountRepository");

const app = express();
app.use(express.json());

const loadAccounts = async function () {
  try {
    const data = await getAccounts();
    return data;
  } catch (err) {
    console.error("Error loading accounts -> ", err);
  }
};

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
  loadAccounts,
  loadAccountByName,
  loadAccountsWithUserId,
};
