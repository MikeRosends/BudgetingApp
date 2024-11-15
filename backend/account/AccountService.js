require("dotenv").config();
const express = require("express");
const { getAccounts, findAccountByName } = require("./AccountRepository");

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

const loadAccountByName = async function (accountName, userId) {
  try {
    const data = await findAccountByName(accountName, userId);
    return data;
  } catch (err) {
    console.error("Error loading account by name -> ", err);
  }
};

module.exports = {
  loadAccounts,
  loadAccountByName
};
