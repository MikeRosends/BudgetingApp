const express = require("express");
const {
  loadAccounts,
  loadAccountByName,
  loadAccountsWithUserId,
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

router.get("/v1/account_with_userid", async (req, res) => {
  try {
    const { user_id } = req.query;

    // Validate user_id
    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    // Call the service to get accounts
    const data = await loadAccountsWithUserId(user_id);

    // If no accounts are found, return a 404
    if (data.length === 0) {
      return res
        .status(404)
        .json({ message: "No accounts found for this user" });
    }

    // Return the accounts data
    res.status(200).json(data);
  } catch (err) {
    console.error("Error in /v1/account_with_userid:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/v1/account_by_name", async (req, res) => {
  try {
    const { accountName, user_id } = req.query;
    const data = await loadAccountByName(accountName, user_id);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "error getting accounts" });
  }
});
module.exports = router;
