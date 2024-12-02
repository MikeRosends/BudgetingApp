require("dotenv").config();
const express = require("express");
const { getMovements, createMovement } = require("./movementRepository");

const app = express();
app.use(express.json());

const loadAccounts = async function () {
  try {
    const data = await getMovements();
    console.log("from service -> ", data);

    return data;
  } catch (err) {
    console.error("Error loading movements -> ", err);
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

module.exports = {
  loadAccounts,
  createNewMovement,
};
