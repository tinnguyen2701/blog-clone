const homeRouter = require("express").Router();
const Post = require("../models/postModel");

homeRouter.get("/", async (req, res) => {
  res.render("index", {
    posts: await Post.find({}).sort({ createdAt: -1 })
  });
});

module.exports = homeRouter;
