import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    // 🔹 Game info
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },

    // 🔹 Round info (combined here)
    date: {
      type: Date,
      required: true,
    },

    roundType: {
      type: String,
      enum: ["FR", "SR"], // First Round / Second Round
      required: true,
    },

    // 🔹 Raw data entered by admin
    totalArrowsShot: {
      type: Number,
      required: true,
    },

    totalHits: {
      type: Number,
      required: true,
    },

    // 🔹 System calculated result
    resultNumber: {
      type: String, // "05", "37"
      required: true,
    },
    directNumber: {
       type: [String], // "05", "37"
      default: null,
    },

    // 🔹 Admin info
    declaredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    declaredAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// 🔒 One result per game + date + round
resultSchema.index(
  { game: 1, date: 1, roundType: 1 },
  { unique: true }
);

export default mongoose.model("Result", resultSchema);
