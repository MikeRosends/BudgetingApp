require("dotenv").config();
const express = require("express");
const {
  findAccountByName,
  getAccountsWithUserId,
  getAccountTotalAmount,
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

const loadAccountTotalAmount = async function (user_id) {
  console.log('SERVICE -> ', user_id);
  
  try {
    const data = await getAccountTotalAmount(user_id);
    return data;
  } catch (err) {
    console.error(`Error loading total account for selected user -> `, err);
    
  }
}

module.exports = {
  loadAccountByName,
  loadAccountsWithUserId,
  loadAccountTotalAmount
};
