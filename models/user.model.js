const mongoose = require("mongoose");

const user = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    kyc: {
      type: mongoose.Types.ObjectId,
      ref: "Kyc",
    },
    posts: [{ type: mongoose.Types.ObjectId, ref: "Post" }],
    articles: [{ type: mongoose.Types.ObjectId, ref: "Article" }],
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", user);
module.exports = userModel;
