const express = require("express");
const router  = express.Router();
const jwt     = require("jsonwebtoken");
const User    = require("../models/User");
const { requireAuth } = require("../middleware/auth");

const generateToken = (user) =>
  jwt.sign(
    { userId: user._id, email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields are required" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ error: "Email already registered" });

    const user  = await User.create({ name, email, password, role: "student" });
    const token = generateToken(user);

    res.status(201).json({ user, token });
  } catch (err) {
    console.error(err);
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

    const token = generateToken(user);
    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/auth/logout — client just deletes token
router.post("/logout", (req, res) => {
  res.json({ message: "Logged out" });
});

// GET /api/auth/me
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
