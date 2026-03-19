require("dotenv").config();
const mongoose = require("mongoose");
const User     = require("./models/User");

// ── Change these before running ──
const ADMIN_NAME     = "Admin";
const ADMIN_EMAIL    = "admin@school.com";
const ADMIN_PASSWORD = "admin1234";
// ─────────────────────────────────

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  const exists = await User.findOne({ email: ADMIN_EMAIL });
  if (exists) {
    console.log("⚠️  Admin already exists:", ADMIN_EMAIL);
    process.exit(0);
  }

  await User.create({
    name:     ADMIN_NAME,
    email:    ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role:     "admin",
  });

  console.log("✅ Admin created!");
  console.log("   Email:   ", ADMIN_EMAIL);
  console.log("   Password:", ADMIN_PASSWORD);
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
