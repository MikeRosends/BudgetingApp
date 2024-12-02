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

  console.log('VALUES RECEIVED in repo >>>>', 
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

module.exports = { getMovements, createMovement };
