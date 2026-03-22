const express     = require("express");
const session     = require("express-session");
const cors        = require("cors");
const mongoose    = require("mongoose");
const MongoStore  = require("connect-mongo");
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
app.use(cors({
  origin: true,
  credentials: true,
}));

// ── Middleware ──
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || "assignment-tracker-secret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  },
  proxy: true,
}));

// ── Routes ──
app.use("/api/auth",        authRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/users",       userRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
