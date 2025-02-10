const express = require("express");
const studentRoutes = require("./routes/user.route");
const postRoutes = require("./routes/post.route");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("connected to database");
  })
  .catch(() => {
    console.log("something went wrong");
  });

app.use(studentRoutes);
app.use(postRoutes);
app.listen(PORT, () => {
  console.log("app is running");
});
