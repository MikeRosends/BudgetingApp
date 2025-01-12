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
  category_code,
  user_id,
  description,
  movement_name
) {
  console.log(
    "VALUES RECEIVED in repo >>>>",
    amount,
    movement_date,
    category_code,
    user_id,
    description,
    movement_name
  );

  const query = `
  INSERT
  INTO "movements"(
    "amount",
    "movement_date",
    "category_code",
    "user_id",
    "description",
    "movement_name"
    )
  VALUES($1, $2, $3, $4, $5, $6)
  RETURNING *;`; // RETURNING * to get the inserted row(s)

  try {
    const { rows } = await pgConnection.query(query, [
      amount,
      movement_date,
      category_code,
      user_id,
      description,
      movement_name,
    ]);

    return rows[0];
  } catch (err) {
    console.error("Error creating new movement -> ", err);
    throw new Error("Database create new movement query failed");
  }
};

const deleteMovement = async function (id) {
  console.log("Deleting movement with id:", id);

  const query = `
  DELETE FROM "movements"
  WHERE "id" = $1
  RETURNING *;`; // RETURNING * to get details of the deleted row(s)

  try {
    const { rows } = await pgConnection.query(query, [id]);

    if (!rows.length) {
      throw new Error(`No movement found with id ${id}`);
    }

    return rows[0]; // Return the deleted movement's details
  } catch (err) {
    console.error("Error deleting movement -> ", err);
    throw new Error("Database delete movement query failed");
  }
};

const updateMovement = async function (
  id,
  { amount, movement_date, category_code, user_id, description, movement_name }
) {
  console.log("Updating movement with id:", id);

  const query = `
  UPDATE "movements"
  SET
    "amount" = COALESCE($2, "amount"),
    "movement_date" = COALESCE($3, "movement_date"),
    "category_code" = COALESCE($4, "category_code"),
    "user_id" = COALESCE($5, "user_id"),
    "description" = COALESCE($6, "description"),
    "movement_name" = COALESCE($7, "movement_name")
  WHERE "id" = $1
  RETURNING *;`;

  try {
    const { rows } = await pgConnection.query(query, [
      id,
      amount,
      movement_date,
      category_code,
      user_id,
      description,
      movement_name,
    ]);

    if (!rows.length) {
      throw new Error(`No movement found with id ${id}`);
    }

    return rows[0]; // Return the updated movement's details
  } catch (err) {
    console.error("Error updating movement -> ", err);
    throw new Error("Database update movement query failed");
  }
};

const getMovementsByUserId = async function (user_id) {
  try {
    const query = `
    SELECT * FROM movement_v2 WHERE user_id = $1 
ORDER BY movement_date DESC 
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

const getMainCategories = async function () {
  console.log("Fetching main categories from repository...");
  const query = `
    SELECT DISTINCT "category"
    FROM "categories"
    ORDER BY "category";
  `;

  try {
    const { rows } = await pgConnection.query(query);
    return rows.map((row) => row.category); // Return array of main categories
  } catch (err) {
    console.error("Error fetching main categories -> ", err);
    throw new Error("Database query to fetch main categories failed");
  }
};

const getSubcategoriesByCategory = async function (mainCategory) {
  console.log("Fetching subcategories for main category:", mainCategory);
  const query = `
    SELECT "subcategory", "category_code"
    FROM "categories"
    WHERE "category" = $1
    ORDER BY "subcategory";
  `;

  try {
    const { rows } = await pgConnection.query(query, [mainCategory]);
    return rows;
  } catch (err) {
    console.error("Error fetching subcategories -> ", err);
    throw new Error("Database query to fetch subcategories failed");
  }
};



module.exports = {
  getMovements,
  createMovement,
  getMovementsByUserId,
  getUserTotalAmount,
  deleteMovement,
  updateMovement,
  getMainCategories,
  getSubcategoriesByCategory,
};
