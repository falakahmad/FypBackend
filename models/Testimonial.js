// models/Testimonial.js
import mongoose from "mongoose";
import dayjs from "dayjs";

const testimonialSchema = new mongoose.Schema({
  image: { type: String, required: true },
  name: { type: String, required: true },
  designation: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  short_description: { type: String, required: true },
  is_approved: { type: Boolean, default: false }, // mirror SQL default
  created_at: { type: Date, default: () => dayjs().toDate() },
  updated_at: { type: Date, default: null }, // null until modification
  deleted_at: { type: Date, default: null }, // null until soft‐delete
});

// Auto‐update `updated_at` on any findOneAndUpdate call
testimonialSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updated_at: dayjs().toDate() });
  next();
});

export default mongoose.model("Testimonial", testimonialSchema);
