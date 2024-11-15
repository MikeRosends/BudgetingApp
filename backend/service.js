require('dotenv').config();
const express = require("express");
const { getAccounts } = require('./repository')

const app = express();
app.use(express.json());

const testFunction = async function() {
  try {
    const data = 'Hello World!';
    return data
  } catch (err) {
    console.error('ERROR loading test function:', err);
  }
}

const loadAccounts = async function() {
  try {
    const data = await getAccounts();
    return data;
    
  } catch (err) {
    console.error('Error loading accounts -> ', err);
    
  }
}

module.exports = {
  testFunction,
  loadAccounts
};
