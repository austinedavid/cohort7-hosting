const mongoose = require("mongoose");

const kycSchema = new mongoose.Schema(
  {
    frontPix: {
      type: String,
      required: true,
    },
    backPix: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      required: true,
      default: false,
    },
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
      unique: true,
    },
  },
  { timestamps: true }
);

const kycModel = mongoose.model("Kyc", kycSchema);
module.exports = kycModel;
