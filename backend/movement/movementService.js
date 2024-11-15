require('dotenv').config();
const express = require("express");
const { getMovements } = require('./movementRepository')

const app = express();
app.use(express.json());

const loadAccounts = async function() {
  try {
    const data = await getMovements();
    console.log('from service -> ', data);
    
    return data;
    
  } catch (err) {
    console.error('Error loading movements -> ', err);
    
  }
}

module.exports = {
  loadAccounts
};
