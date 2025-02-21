const express = require("express");
const {
  getTotalAmountForUser,
  createNewMovement,
  loadMovementsByUserId,
  loadUserTotalAmount,
  loadMovementCategories,
  deleteExistingMovement,
  updateExistingMovement,
  fetchMainCategories,
  fetchSubcategories,
  createMainCategory,
  calculateBalanceProgression,
  fetchStartingAmount,
  modifyStartingAmount,
  addStartingAmount,
  getCategorySpending,
  getSubcategorySpending,
} = require("./movementService");
const authMiddleware = require("../user/authMiddleware");

const router = express.Router();

router.get("/v1/movements_with_user_id", async (req, res) => {
  try {
    const { user_id } = req.query;

    console.log("user_id CONTROLLER -> ", user_id);

    if (!user_id)
      return res.status(400).json({ message: "no user_id was found" });

    const data = await loadMovementsByUserId(user_id);

    if (data.length === 0)
      return res.status(404).json({ message: "No movements available" });

    res.status(200).json(data);
  } catch (err) {
    console.error("Error with the route /v1/movements_with_user_id ->", err);
    res.status(500).json({ message: "error getting movements" });
  }
});

router.post("/v1/new_movment", async (req, res) => {
  const {
    amount,
    movement_date,
    category_code,
    user_id,
    description,
    movement_name,
    type,
  } = req.body;

  console.log("NEW MOVEMENT POST WAS CALLED");

  console.log(
    "DATA RECEIVED IN CONTROLLER: ",
    amount,
    movement_date,
    category_code,
    user_id,
    description,
    movement_name,
    type
  );

  try {
    await createNewMovement(
      amount,
      movement_date,
      category_code,
      user_id,
      description,
      movement_name,
      type
    );
    res.status(201).json({ message: "Movment created successfully" });
  } catch (err) {
    console.error("Error in /v1/new_movment route", err);
    res.status(500).json({ message: "Error creating movement" });
  }
});

router.delete("/v1/movement/:id", async (req, res) => {
  const { id } = req.params;

  console.log("DELETE MOVEMENT WAS CALLED");
  console.log("ID RECEIVED IN CONTROLLER: ", id);

  try {
    const result = await deleteExistingMovement(id);
    res
      .status(200)
      .json({ message: "Movement deleted successfully", data: result });
  } catch (err) {
    console.error("Error in DELETE /v1/movement/:id route", err);
    res.status(500).json({ message: "Error deleting movement" });
  }
});

router.put("/v1/movement/:id", async (req, res) => {
  const { id } = req.params;
  const {
    amount,
    movement_date,
    category_code,
    user_id,
    description,
    movement_name,
    type,
  } = req.body;

  try {
    const result = await updateExistingMovement(id, {
      amount,
      movement_date,
      category_code,
      user_id,
      description,
      movement_name,
      type,
    });
    res
      .status(200)
      .json({ message: "Movement updated successfully", data: result });
  } catch (err) {
    console.error("Error in PUT /v1/movement/:id route", err);
    res.status(500).json({ message: "Error updating movement" });
  }
});

router.get("/v1/user_total_amount", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id; // Extracting user_id from the decoded token
    const totalAmount = await getTotalAmountForUser(user_id); // Calculate total
    res.status(200).json({ user_id, totalAmount });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error getting selected user's total amount" });
  }
});

router.get("/v1/movement_categories", async (req, res) => {
  console.log("Movement Controller");

  try {
    const data = await loadMovementCategories();

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Error getting categories" });
  }
});

// Route to get main categories
router.get("/v1/categories/main", async (req, res) => {
  try {
    const mainCategories = await fetchMainCategories();
    res.status(200).json(mainCategories);
  } catch (err) {
    res.status(500).json({ error: "Error fetching main categories" });
  }
});

// Route to create a new main category
router.post("/v1/categories/main", async (req, res) => {
  console.log("POST /v1/categories/main route hit");
  
  const { category, subcategory } = req.body;
  console.log("categoryName: ", category);
  console.log("subCategoryName: ", subcategory);
  

  if (!category && !subcategory) {
    return res.status(400).json({ message: "Category and Subcategory name is required" });
  }

  try {
    const newCategory = await createMainCategory(category, subcategory);
    res.status(201).json(newCategory);
  } catch (err) {
    console.error("Error in POST /v1/categories/main route:", err);
    res.status(500).json({ message: "Error creating new category" });
  }
});

// Route to get subcategories for a main category
router.get("/v1/categories/subcategories/:mainCategory", async (req, res) => {
  const { mainCategory } = req.params;
  try {
    const subcategories = await fetchSubcategories(mainCategory);
    res.status(200).json(subcategories);
  } catch (err) {
    res.status(500).json({ error: "Error fetching subcategories" });
  }
});

router.get("/v1/balance_progression", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Both startDate and endDate are required." });
    }

    const balanceProgression = await calculateBalanceProgression(
      user_id,
      startDate,
      endDate
    );

    res.status(200).json(balanceProgression);
  } catch (err) {
    console.error("Error in /v1/balance_progression route:", err);
    res.status(500).json({ message: "Error fetching balance progression." });
  }
});

// Fetch the starting amount for the logged-in user
router.get("/v1/starting_amount", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id; // Extract user ID from the decoded token
    const result = await fetchStartingAmount(user_id);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching starting amount" });
  }
});

// Update the starting amount for the logged-in user
router.put("/v1/starting_amount", authMiddleware, async (req, res) => {
  const { starting_amount } = req.body;

  if (starting_amount == null) {
    return res.status(400).json({ message: "Starting amount is required" });
  }

  try {
    const user_id = req.user.id; // Extract user ID from the decoded token
    const result = await modifyStartingAmount(user_id, starting_amount);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating starting amount" });
  }
});

// Insert a new starting amount for a user
router.post("/v1/starting_amount", authMiddleware, async (req, res) => {
  const { starting_amount } = req.body;

  if (starting_amount == null) {
    return res.status(400).json({ message: "Starting amount is required" });
  }

  try {
    const user_id = req.user.id; // Extract user ID from the decoded token
    const result = await addStartingAmount(user_id, starting_amount);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error inserting starting amount" });
  }
});

router.get("/v1/category_spending", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id; // Extracting user ID from the decoded token
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Start date and end date are required." });
    }

    const categorySpending = await getCategorySpending(
      user_id,
      startDate,
      endDate
    );

    res.status(200).json(categorySpending);
  } catch (err) {
    console.error("Error in /v1/category_spending route:", err);
    res.status(500).json({ message: "Error fetching category spending." });
  }
});

router.get("/v1/subcategory_spending", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id; // Extracting user ID from the decoded token
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Start date and end date are required." });
    }

    const subcategorySpending = await getSubcategorySpending(
      user_id,
      startDate,
      endDate
    );

    res.status(200).json(subcategorySpending);
  } catch (err) {
    console.error("Error in /v1/subcategory_spending route:", err);
    res.status(500).json({ message: "Error fetching subcategory spending." });
  }
});

module.exports = router;
