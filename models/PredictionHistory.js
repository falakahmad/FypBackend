import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true, // now required instead of userId
    },
    mode: {
      type: String,
      enum: ["triage", "diagnosis", "full"],
      required: true,
    },
    symptoms: [
      {
        id: String,
        label: String,
      },
    ],
    result: {
      condition: String, // e.g. disease name or triage result
      probability: Number, // for diagnosis mode
      emergency: String, // for triage mode
    },
  },
  {
    timestamps: true, // auto adds createdAt and updatedAt
  }
);

export const History = mongoose.model("History", historySchema);
