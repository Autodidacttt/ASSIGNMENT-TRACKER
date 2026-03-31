const express   = require("express");
const cors      = require("cors");
const mongoose  = require("mongoose");
require("dotenv").config();

const authRoutes       = require("./routes/auth");
const assignmentRoutes = require("./routes/assignments");
const userRoutes       = require("./routes/users");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Trust proxy (required for Railway) ──
app.set("trust proxy", 1);

// ── MongoDB ──
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ── CORS ──
app.use(cors({ origin: true, credentials: true }));

// ── Middleware ──
app.use(express.json());

// ── Routes ──
app.use("/api/auth",        authRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/users",       userRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
