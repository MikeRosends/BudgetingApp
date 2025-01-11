const express = require("express");
const {
  createNewMovement,
  loadMovementsByUserId,
  loadUserTotalAmount,
  loadMovementCategories,
  deleteExistingMovement,
  updateExistingMovement
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
  } = req.body;

  console.log("NEW MOVEMENT POST WAS CALLED");

  console.log(
    "DATA RECEIVED IN CONTROLLER: ",
    amount,
    movement_date,
    category_code,
    user_id,
    description,
    movement_name
  );

  try {
    await createNewMovement(
      amount,
      movement_date,
      category_code,
      user_id,
      description,
      movement_name
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
    res.status(200).json({ message: "Movement deleted successfully", data: result });
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
  } = req.body;

  console.log("UPDATE MOVEMENT WAS CALLED");
  console.log("DATA RECEIVED IN CONTROLLER: ", {
    id,
    amount,
    movement_date,
    category_code,
    user_id,
    description,
    movement_name,
  });

  try {
    const result = await updateExistingMovement(id, {
      amount,
      movement_date,
      category_code,
      user_id,
      description,
      movement_name,
    });
    res.status(200).json({ message: "Movement updated successfully", data: result });
  } catch (err) {
    console.error("Error in PUT /v1/movement/:id route", err);
    res.status(500).json({ message: "Error updating movement" });
  }
});


router.get("/v1/user_total_amount", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id; // Extracting user_id from the decoded token

    const data = await loadUserTotalAmount(user_id);

    res.json(data);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error getting selected user's total amount" });
  }
});

router.get('/v1/movement_categories', async (req, res) => {
  console.log('Movement Controller');
  
  try {
    const data = await loadMovementCategories();

    res.status(200).json(data);
  } catch (err) {
    
    res.status(500).json({ message: "Error getting categories" });
  }
})

module.exports = router;
