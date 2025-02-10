const express = require("express");
const {
  createPost,
  getAllPosts,
  getOnePost,
  deletePost,
  updatePost,
} = require("../controllers/post.controller");
const authorization = require("../middlewares/authorization");
const routes = express.Router();

routes.post("/post", authorization, createPost);
routes.get("/post", getAllPosts);
routes.get("/post/:id", getOnePost);
routes.delete("/post/:id", authorization, deletePost);
routes.put("/post/:id", authorization, updatePost);

module.exports = routes;
