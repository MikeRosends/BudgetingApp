const express = require("express");
const { loadAccounts, createNewMovement } = require("./movementService");
const router = express.Router();

router.get("/v1/movements", async (req, res) => {
  try {
    const data = await loadAccounts();
    res.json(data);
  } catch (err) {
    console.error(err);
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

  console.log('VALUES RECEIVED in controller >>>>', 
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

module.exports = router;
