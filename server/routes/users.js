const express = require("express");
const router  = express.Router();
const User    = require("../models/User");
const { requireAdmin } = require("../middleware/auth");

// GET /api/users — admin gets all students
router.get("/", requireAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: "student" }).sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/users/:id — admin gets one student
router.get("/:id", requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/users/:id — admin removes a student
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
