// models/Game.js
import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // e.g. "Shillong Teer"
    },

    location: {
      type: String, // optional
    },

    description: {
      type: String, // optional
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Game", gameSchema);
