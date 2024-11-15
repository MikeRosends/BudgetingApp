const express = require("express");
const { testFunction, loadAccounts } = require("./service");

const router = express.Router();

router.get("/v1/test", async (req, res) => {
  try {
    const testData = await testFunction();
    res.json(testData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "error on controller" });
  }
});

router.get("/v1/accounts", async (req, res) => {
  try {
    const data = await loadAccounts();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "error getting accounts" });
  }
});
module.exports = router;
