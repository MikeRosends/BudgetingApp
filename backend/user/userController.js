const express = require("express");
const { loadUsers } = require("./userService");
const router = express.Router();

router.get("/v1/users", async (req, res) => {
  try {
    const data = await loadUsers();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "error getting users" });
  }
});
module.exports = router;
