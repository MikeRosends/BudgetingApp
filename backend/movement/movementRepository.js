const { query } = require("express");
const pgConnection = require("../secrets/dbConnections");

const getMovements = async function () {
  const query = `
  SELECT * FROM public.movement;
  `;
  try {
    const { rows } = await pgConnection.query(query);

    return rows;
  } catch (err) {
    console.error("Error fetching movements", err);
  }
};

const createMovement = async function (
  amount,
  movement_date,
  movement_type_code,
  movement_type_name,
  user_id_id,
  description,
  movement_name
) {
  console.log(
    "VALUES RECEIVED in repo >>>>",
    amount,
    movement_date,
    movement_type_code,
    movement_type_name,
    user_id_id,
    description,
    movement_name
  );

  const query = `
  INSERT
  INTO "movement_v2"(
    "amount",
    "movement_date",
    "movement_type_code",
    "movement_type_name",
    "user_id_id",
    "description",
    "movement_name"
    )
  VALUES($1, $2, $3, $4, $5, $6, $7)
  RETURNING *;`; // RETURNING * to get the inserted row(s)

  try {
    const { rows } = await pgConnection.query(query, [
      amount,
      movement_date,
      movement_type_code,
      movement_type_name,
      user_id_id,
      description,
      movement_name,
    ]);

    return rows[0];
  } catch (err) {
    console.error("Error creating new movement -> ", err);
    throw new Error("Database create new movement query failed");
  }
};

const getMovementsByUserId = async function (user_id) {
  try {
    const query = `
    SELECT * FROM movement_v2 WHERE user_id = $1
    `;

    const { rows } = await pgConnection.query(query, [user_id]);

    console.log("DATA FROM getMovementsByUserId -->>> ", rows[0]);

    return rows;
  } catch (err) {
    console.error("Error fetching movements", err);
  }
};

const findAccountByName = async function (accountName, user_id) {
  try {
    const query = `
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

const getUserTotalAmount = async function (user_id) {
  console.log('REPO -> ', user_id);
  
  try {
    const query = `
    SELECT * FROM public.get_total_amount_per_user() WHERE user_id = $1
    `;
    const { rows } = await pgConnection.query(query, [user_id]);
    console.log(rows[0].total_amount);
    

    return rows[0].total_amount;
  } catch (err) {
    console.error(`Error fetching total amount from selected user -> `, err);
  }
};

module.exports = { getMovements, createMovement, getMovementsByUserId, getUserTotalAmount };
