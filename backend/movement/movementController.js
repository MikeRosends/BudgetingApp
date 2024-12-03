const express = require("express");
const {
  createNewMovement,
  loadMovementsByUserId,
  loadUserTotalAmount,
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
    movement_type_code,
    movement_type_name,
    user_id_id,
    description,
    movement_name,
  } = req.body;

  console.log(
    "VALUES RECEIVED in controller >>>>",
    amount,
    movement_date,
    movement_type_code,
    movement_type_name,
    user_id_id,
    description,
    movement_name
  );

  try {
    await createNewMovement(
      amount,
      movement_date,
      movement_type_code,
      movement_type_name,
      user_id_id,
      description,
      movement_name
    );
    res.status(201).json({ message: "Movment created successfully" });
  } catch (err) {
    console.error("Error in /v1/new_movment route", err);
    res.status(500).json({ message: "Error creating movement" });
  }
});

router.get("/v1/user_total_amount", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id; // Extracting user_id from the decoded token
    console.log("CONTROLLER -> ", user_id);

    const data = await loadUserTotalAmount(user_id);
    console.log(data);

    res.json(data);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error getting selected user's total amount" });
  }
});

module.exports = router;
