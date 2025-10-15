import mongoose from "mongoose";
import dayjs from "dayjs";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  created_at: { type: Date, default: () => dayjs().toDate() },
  updated_at: { type: Date, default: null },
  deleted_at: { type: Date, default: null },
});

// 🔐 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// 📅 Auto-update `updated_at` on findOneAndUpdate
userSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updated_at: dayjs().toDate() });
  next();
});

export default mongoose.model("User", userSchema);
