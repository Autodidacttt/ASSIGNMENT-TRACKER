const express = require("express");
const router  = express.Router();
const User    = require("../models/User");

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields are required" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ error: "Email already registered" });

    const user = await User.create({ name, email, password, role: "student" });

    // Auto login after register
    req.session.userId = user._id;
    req.session.role   = user.role;

    res.status(201).json({ user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ error: "No account found with this email" });

    const match = await user.comparePassword(password);
    if (!match)
      return res.status(401).json({ error: "Incorrect password" });

    req.session.userId = user._id;
    req.session.role   = user.role;

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
});

// GET /api/auth/me — check current session
router.get("/me", async (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ error: "Not authenticated" });

  try {
    const user = await User.findById(req.session.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
