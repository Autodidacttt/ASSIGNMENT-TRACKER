const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  title:      { type: String, required: true, trim: true },
  status:     { type: String, enum: ["pending", "completed"], default: "pending" },
  subject:    { type: String, default: null },
  dueDate:    { type: Date, default: null },
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  createdAt:  { type: Date, default: Date.now },
});

module.exports = mongoose.model("Assignment", assignmentSchema);
