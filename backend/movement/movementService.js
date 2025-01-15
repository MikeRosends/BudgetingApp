require("dotenv").config();
const express = require("express");
const {
  getMovementsForUser,
  createMovement,
  getMovementsByUserId,
  deleteMovement,
  updateMovement,
  getMainCategories,
  getSubcategoriesByCategory,
  getAllCategories,
} = require("./movementRepository");

const app = express();
app.use(express.json());

const getTotalAmountForUser = async (user_id) => {
  try {
    const movements = await getMovementsForUser(user_id); // Get movements with "type" directly

    // Calculate the total directly using the "type" from movements table
    const totalAmount = movements.reduce((sum, movement) => {
      return sum + movement.amount * movement.type; // Multiply amount by type (1 for deposit, -1 for expense)
    }, 0);

    return totalAmount;
  } catch (err) {
    console.error("Error in getTotalAmountForUser service", err);
    throw new Error("Failed to calculate total amount");
  }
};


const loadMovementsByUserId = async function (user_id) {
  try {
    // Fetch movements
    const movements = await getMovementsByUserId(user_id);

    // Fetch all categories once to avoid multiple DB calls
    const categories = await getAllCategories(); // A new service function to fetch all categories

    // Map categories for quick access
    const categoryMap = categories.reduce((map, category) => {
      map[category.category_code] = {
        category: category.category,
        subcategory: category.subcategory,
      };
      return map;
    }, {});

    // Enrich movements with category and subcategory names
    const enrichedMovements = movements.map((movement) => {
      const categoryData = categoryMap[movement.category_code] || {};
      return {
        ...movement,
        category: categoryData.category || "Unknown",
        subcategory: categoryData.subcategory || "N/A",
      };
    });

    console.log("Enriched Movements:", enrichedMovements);
    return enrichedMovements;
  } catch (err) {
    console.error("Error loading movements with user_id -> ", err);
  }
};


const createNewMovement = async function (
  amount,
  movement_date,
  category_code,
  user_id,
  description,
  movement_name,
  type
) {
  console.log(
    "VALUES RECEIVED in service >>>>",
    amount,
    movement_date,
    category_code,
    user_id,
    description,
    movement_name,
    type
  );
  try {
    const result = await createMovement(
      amount,
      movement_date,
      category_code,
      user_id,
      description,
      movement_name,
      type
    );

    console.log("Service success!!");
    return result;
  } catch (err) {
    console.error("Error loading movement by the service layer -> ", err);
    throw err;
  }
};

const deleteExistingMovement = async function (id) {
  console.log("VALUES RECEIVED in service for deletion >>>>", id);
  try {
    const result = await deleteMovement(id); // Call to the repository function
    console.log("Movement successfully deleted in the service layer!!");
    return result;
  } catch (err) {
    console.error("Error deleting movement by the service layer -> ", err);
    throw err; // Rethrow the error for the controller to handle
  }
};

const updateExistingMovement = async function (
  id,
  { amount, movement_date, category_code, user_id, description, movement_name }
) {
  console.log("VALUES RECEIVED in service for update >>>>", {
    id,
    amount,
    movement_date,
    category_code,
    user_id,
    description,
    movement_name,
  });
  try {
    const result = await updateMovement(id, {
      amount,
      movement_date,
      category_code,
      user_id,
      description,
      movement_name,
    });

    console.log("Movement successfully updated in the service layer!!");
    return result;
  } catch (err) {
    console.error("Error updating movement by the service layer -> ", err);
    throw err; // Rethrow the error for the controller to handle
  }
};

const loadUserTotalAmount = async function (user_id) {
  try {
    const data = await getUserTotalAmount(user_id);
    return data;
  } catch (err) {
    console.error(`Error loading total amount for selected user -> `, err);
  }
};

const loadMovementCategories = async () => {
  console.log("Movement Service");
  try {
    const groupByCategory = (data) => {
      const grouped = {};

      data.forEach((row) => {
        if (!grouped[row.category]) {
          grouped[row.category] = [];
        }
        grouped[row.category].push({
          label: row.subcategory,
          code: row.code,
        });
      });

      console.log(grouped);

      return grouped;
    };

    const transformedData = (groupedData) => {
      return Object.entries(groupedData).map(([category, subcategory]) => ({
        category,
        subcategory,
      }));
    };

    const data = await getMovementCategories();

    const groupedData = groupByCategory(data);

    return transformedData(groupedData);
  } catch (err) {
    console.error("Error loading movement categories", err);
  }
};

// Service function to get main categories
const fetchMainCategories = async () => {
  try {
    const categories = await getMainCategories();
    console.log("Fetched main categories:", categories);
    return categories;
  } catch (err) {
    throw new Error("Error in service layer fetching main categories");
  }
};

// Service function to get subcategories
const fetchSubcategories = async (mainCategory) => {
  try {
    const subcategories = await getSubcategoriesByCategory(mainCategory);
    console.log(`Fetched subcategories for ${mainCategory}:`, subcategories);
    return subcategories; // Returns array of { subcategory, category_code }
  } catch (err) {
    console.error("Error in service layer fetching subcategories:", err);
    throw new Error("Error in service layer fetching subcategories");
  }
};

module.exports = {
  getTotalAmountForUser,
  createNewMovement,
  loadMovementsByUserId,
  loadUserTotalAmount,
  loadMovementCategories,
  deleteExistingMovement,
  updateExistingMovement,
  fetchMainCategories,
  fetchSubcategories,
};
