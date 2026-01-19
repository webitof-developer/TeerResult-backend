// models/Banner.js
import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    description: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Banner", bannerSchema);
