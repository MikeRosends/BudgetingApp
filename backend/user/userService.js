require('dotenv').config();
const express = require("express");
const { getUsers } = require('./userRepository')

const app = express();
app.use(express.json());

const loadUsers = async function() {
  try {
    const data = await getUsers();
    console.log('from service -> ', data);
    
    return data;
    
  } catch (err) {
    console.error('Error loading users -> ', err);
    
  }
}

module.exports = {
  loadUsers
};
