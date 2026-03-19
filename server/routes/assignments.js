const express    = require("express");
const router     = express.Router();
const Assignment = require("../models/Assignment");
const { requireAuth, requireAdmin } = require("../middleware/auth");

// GET /api/assignments — student gets own, admin gets all
router.get("/", requireAuth, async (req, res) => {
  try {
    const filter = req.session.role === "admin"
      ? {}
      : { userId: req.session.userId };

    const assignments = await Assignment.find(filter)
      .populate("userId", "name email")
      .populate("assignedBy", "name")
      .sort({ createdAt: -1 });

    res.json({ assignments });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/assignments/student/:userId — admin only
router.get("/student/:userId", requireAdmin, async (req, res) => {
  try {
    const assignments = await Assignment.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    res.json({ assignments });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/assignments — student adds own, admin assigns to userId
router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, subject, dueDate, userId } = req.body;

    if (!title)
      return res.status(400).json({ error: "Title is required" });

    // Students can only add to themselves
    const targetUserId = req.session.role === "admin" && userId
      ? userId
      : req.session.userId;

    const assignment = await Assignment.create({
      title,
      subject:    subject    || null,
      dueDate:    dueDate    ? new Date(dueDate) : null,
      userId:     targetUserId,
      assignedBy: req.session.role === "admin" ? req.session.userId : null,
    });

    res.status(201).json({ assignment });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/assignments/bulk — admin assigns to multiple students
router.post("/bulk", requireAdmin, async (req, res) => {
  try {
    const { title, subject, dueDate, userIds } = req.body;

    if (!title || !userIds?.length)
      return res.status(400).json({ error: "Title and userIds required" });

    const docs = userIds.map((uid) => ({
      title,
      subject:    subject || null,
      dueDate:    dueDate ? new Date(dueDate) : null,
      userId:     uid,
      assignedBy: req.session.userId,
      status:     "pending",
      createdAt:  new Date(),
    }));

    const assignments = await Assignment.insertMany(docs);
    res.status(201).json({ assignments, count: assignments.length });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// PATCH /api/assignments/:id — update status or dueDate
router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment)
      return res.status(404).json({ error: "Assignment not found" });

    // Students can only update their own
    if (
      req.session.role !== "admin" &&
      assignment.userId.toString() !== req.session.userId.toString()
    ) {
      return res.status(403).json({ error: "Not allowed" });
    }

    const { status, dueDate, subject, title } = req.body;
    if (status  !== undefined) assignment.status  = status;
    if (dueDate !== undefined) assignment.dueDate = dueDate ? new Date(dueDate) : null;
    if (subject !== undefined) assignment.subject = subject;
    if (title   !== undefined) assignment.title   = title;

    await assignment.save();
    res.json({ assignment });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/assignments/:id
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment)
      return res.status(404).json({ error: "Assignment not found" });

    if (
      req.session.role !== "admin" &&
      assignment.userId.toString() !== req.session.userId.toString()
    ) {
      return res.status(403).json({ error: "Not allowed" });
    }

    await assignment.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
