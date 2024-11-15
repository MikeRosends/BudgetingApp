const express = require("express");
const { loadAccounts } = require("./movementService");
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
module.exports = router;
