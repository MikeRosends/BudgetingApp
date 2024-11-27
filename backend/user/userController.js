const express = require("express");
const {
  loadUsers,
  validateUserAndGenerateToken,
  loadUserToDatabase,
} = require("./userService");
const authMiddleware = require("./authMiddleware");
const router = express.Router();

// -=-=-=-=-=-=-=-=-=-=-=-=- TEST-=-=-=-=-=-=-=-=-=-=-=-=-
router.get("/v1/test", authMiddleware, (req, res) => {
  res.json({ message: "Protected route accessed", user: req.user });
});
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

router.get("/v1/users", authMiddleware, async (req, res) => {
  try {
    const data = await loadUsers();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error getting users" });
  }
});

router.post("/v1/register", async (req, res) => {
  const { user_email, user_password } = req.body;

  console.log("REGISTER ENDPOINT BEING CALLED");

  try {
    await loadUserToDatabase(user_email, user_password);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error in register route:", err);

    // Handle validation and database errors
    if (err.message === "Username and user_password are required") {
      res.status(400).json({ message: err });
    } else {
      res.status(500).json({ message: "Error registering user" });
    }
  }
});

router.post("/v1/login", async (req, res) => {
  const { user_email, user_password } = req.body;

  if (!user_email || !user_password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  try {
    const token = await validateUserAndGenerateToken(user_email, user_password);
    res.json({ token });
  } catch (err) {
    if (err.message === "User not found") {
      return res.status(404).json({ message: "User not found" });
    } else if (err.message === "Invalid credentials") {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    console.error("Error during login", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/v1/protected-route", authMiddleware, (req, res) => {
  const user_id = req.user.id; // Extract user_id from the token
  res.json({ message: `Welcome, User ${user_id}!` });
});

module.exports = router;
