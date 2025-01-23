const { query } = require("express");
const pgConnection = require("../secrets/dbConnections");

const getMovementsForUser = async (user_id) => {
  const query = `
    SELECT user_id, amount, category_code, type
    FROM public.movements
    WHERE user_id = $1
    ORDER BY id ASC;
  `;
  const { rows } = await pgConnection.query(query, [user_id]);
  return rows;
};

const getTotalAmountByUser = async (user_id) => {
  const query = `
  SELECT 
      user_id,
      SUM(amount * type) AS total_amount
  FROM 
      public.movements
  WHERE user_id = $1
  GROUP BY user_id
          `;
  try {
    const { rows } = await pgConnection.query(query, [user_id]);

    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    console.error("Error getting total amount -> ", err);
    throw new Error("Failed to get total amount from database");
  }
};

const createMovement = async function (
  amount,
  movement_date,
  category_code,
  user_id,
  description,
  movement_name,
  type
) {
  console.log(
    "VALUES RECEIVED in repo >>>>",
    amount,
    movement_date,
    category_code,
    user_id,
    description,
    movement_name,
    type
  );

  const query = `
  INSERT
  INTO "movements"(
    "amount",
    "movement_date",
    "category_code",
    "user_id",
    "description",
    "movement_name",
    "type"
    )
  VALUES($1, $2, $3, $4, $5, $6, $7)
  RETURNING *;`; // RETURNING * to get the inserted row(s)

  try {
    const { rows } = await pgConnection.query(query, [
      amount,
      movement_date,
      category_code,
      user_id,
      description,
      movement_name,
      type,
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
  { amount, movement_date, category_code, user_id, description, movement_name, type }
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
    "movement_name" = COALESCE($7, "movement_name"),
    "type" = COALESCE($8, "type")
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
      type,
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
    SELECT * FROM movements WHERE user_id = $1
    ORDER BY movement_date DESC, id DESC;
    `;

    const { rows } = await pgConnection.query(query, [user_id]);

    console.log("DATA FROM getMovementsByUserId -->>> ", rows[0]);

    return rows;
  } catch (err) {
    console.error("Error fetching movements", err);
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

const getAllCategories = async () => {
  try {
    const query = `
      SELECT "category_code", "category", "subcategory"
      FROM "categories";
    `;
    const { rows } = await pgConnection.query(query);
    return rows;
  } catch (err) {
    console.error("Error fetching categories:", err);
    throw new Error("Error fetching categories");
  }
};

const getMovementsInDateRange = async (user_id, startDate, endDate) => {
  const query = `
    WITH initial_balance AS (
      SELECT COALESCE(SUM(amount * type), 0) AS balance
      FROM public.movements
      WHERE user_id = $1 AND movement_date < $2
    ),
    movements_with_balance AS (
      SELECT 
        movement_date, 
        amount, 
        type, 
        SUM(amount * type) OVER (ORDER BY movement_date ASC) AS running_balance
      FROM public.movements
      WHERE user_id = $1 AND movement_date BETWEEN $2 AND $3
    )
    SELECT 
      m.movement_date,
      m.amount,
      m.type,
      (i.balance + m.running_balance) AS balance_after_movement
    FROM movements_with_balance m, initial_balance i
    ORDER BY m.movement_date DESC;
  `;

  try {
    const { rows } = await pgConnection.query(query, [
      user_id,
      startDate,
      endDate,
    ]);
    return rows;
  } catch (err) {
    console.error("Error fetching movements in date range:", err);
    throw new Error("Failed to fetch movements for the specified date range.");
  }
};


// Fetch the starting amount for a user
const getStartingAmount = async (user_id) => {
  const query = `
    SELECT starting_amount, last_updated
    FROM starting_amounts
    WHERE user_id = $1;
  `;
  const { rows } = await pgConnection.query(query, [user_id]);
  return rows[0]; // Return the starting amount row
};

// Update the starting amount for a user
const updateStartingAmount = async (user_id, new_amount) => {
  const query = `
    UPDATE starting_amounts
    SET starting_amount = $1, last_updated = CURRENT_TIMESTAMP
    WHERE user_id = $2
    RETURNING *;
  `;
  const { rows } = await pgConnection.query(query, [new_amount, user_id]);
  return rows[0]; // Return the updated row
};

// Insert a new starting amount for a user
const insertStartingAmount = async (user_id, starting_amount) => {
  const query = `
    INSERT INTO starting_amounts (user_id, starting_amount)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const { rows } = await pgConnection.query(query, [user_id, starting_amount]);
  return rows[0]; // Return the inserted row
};

const getCategorySpendingFromDB = async (user_id, startDate, endDate) => {
  const query = `
    SELECT 
      c.category, 
      SUM(m.amount * m.type) AS total_spent
    FROM 
      public.movements m
    INNER JOIN 
      public.categories c
    ON 
      m.category_code = c.category_code
    WHERE 
      m.user_id = $1
      AND m.movement_date BETWEEN $2 AND $3
    GROUP BY 
      c.category
    ORDER BY 
      total_spent DESC;
  `;

  try {
    const { rows } = await pgConnection.query(query, [user_id, startDate, endDate]);
    return rows;
  } catch (err) {
    console.error("Error fetching category spending from the database:", err);
    throw new Error("Database query failed.");
  }
};

module.exports = {
  getTotalAmountByUser,
  getMovementsForUser,
  createMovement,
  getMovementsByUserId,
  deleteMovement,
  updateMovement,
  getMainCategories,
  getSubcategoriesByCategory,
  getAllCategories,
  getMovementsInDateRange,
  getStartingAmount,
  updateStartingAmount,
  insertStartingAmount,
  getCategorySpendingFromDB,
};
