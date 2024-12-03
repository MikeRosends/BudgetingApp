require("dotenv").config();
const express = require("express");
const { createMovement, getMovementsByUserId, getUserTotalAmount } = require("./movementRepository");

const app = express();
app.use(express.json());

const loadMovementsByUserId = async function (user_id) {
  try {
    const data = await getMovementsByUserId(user_id);
    console.log("from service -> ", data);

    return data;
  } catch (err) {
    console.error("Error loading movements with user_id -> ", err);
  }
};

const createNewMovement = async function (
  amount,
  movement_date,
  movement_type_code,
  movement_type_name,
  user_id_id,
  description,
  movement_name
) {
  console.log(
    "VALUES RECEIVED in service >>>>",
    amount,
    movement_date,
    movement_type_code,
    movement_type_name,
    user_id_id,
    description,
    movement_name
  );
  try {
    const result = await createMovement(
      amount,
      movement_date,
      movement_type_code,
      movement_type_name,
      user_id_id,
      description,
      movement_name
    );

    console.log("Service success!!");
    return result;
  } catch (err) {
    console.error("Error loading movement by the service layer -> ", err);
    throw err;
  }
};

const loadUserTotalAmount = async function (user_id) {
  console.log('SERVICE -> ', user_id);
  
  try {
    const data = await getUserTotalAmount(user_id);
    return data;
  } catch (err) {
    console.error(`Error loading total amount for selected user -> `, err);
    
  }
}

module.exports = {
  createNewMovement,
  loadMovementsByUserId,
  loadUserTotalAmount
};
