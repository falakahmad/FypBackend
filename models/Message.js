import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  date: { type: Date, default: Date.now },
  seen: { type: Boolean, default: false },
});

export const Message = mongoose.model("Message", messageSchema);
