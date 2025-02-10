const express = require("express");
const {
  createUser,
  getAllUsers,
  deleteUser,
  updateUser,
  getOneUser,
  loginUser,
  createKyc,
  getKyc,
  createArticle,
  getOneArticle,
} = require("../controllers/user.controller");
const authorization = require("../middlewares/authorization");
const routes = express.Router();
// CRUD
routes.post("/user", createUser);
routes.get("/user", getAllUsers);
routes.delete("/user", deleteUser);
routes.put("/user", updateUser);
routes.get("/user/single", authorization, getOneUser);
routes.post("/login", loginUser);
routes.post("/kyc", authorization, createKyc);
routes.get("/kyc/:id", getKyc);
routes.post("/articles", authorization, createArticle);
routes.get("/article/:id", getOneArticle);

module.exports = routes;
