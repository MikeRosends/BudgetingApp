const express = require("express");
const { loadAccounts,   loadAccountByName
} = require("./AccountService");

const router = express.Router();

router.get("/v1/accounts", async (req, res) => {
  try {
    const data = await loadAccounts();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "error getting accounts" });
  }
});

router.get("/v1/account_by_name", async (req, res) => {
  try {
    const { accountName, userId } = req.query;
    const data = await loadAccountByName(accountName, userId);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "error getting accounts" });
  }
});
module.exports = router;
