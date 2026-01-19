import mongoose from "mongoose";

const dreamNumberSchema = new mongoose.Schema(
  {
    dream: {
      type: String, // "Snake", "Cow", "Market"
      required: true,
    },

    numbers: {
      type: [String], // ["17", "27", "77"]
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("DreamNumber", dreamNumberSchema);
