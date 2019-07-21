const postRouter = require("express").Router();
const { isLoggedIn, isOwnerPost } = require("../middlewares/index");
const Post = require("../models/postModel");

postRouter.get("/new", isLoggedIn, (req, res) => res.render("posts/new"));

postRouter.post("/create", isLoggedIn, async (req, res) => {
  const { title, image, body } = req.body;
  try {
    const newPost = new Post({
      title,
      image,
      body,
      userId: req.user._id
    });
    await newPost.save();
    return res.redirect("/");
  } catch (error) {
    return res.render("posts/new", { error: "some thing went wrong" });
  }
});

postRouter.get("/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).populate("comments");
    res.render("posts/view", {
      post
    });
  } catch (error) {
    return res.render("/", { error: "Something went wrong" });
  }
});

postRouter.get("/:postId/edit", isOwnerPost, async (req, res, next) => {
  res.render("posts/edit", {
    post: await Post.findById({ _id: req.params.postId })
  });
});

postRouter.post("/:postId/edit", isOwnerPost, async (req, res, next) => {
  const post = await Post.findById({ _id: req.params.postId });
  post.title = req.body.title;
  post.image = req.body.image;
  post.body = req.body.body;

  post.save();
  res.render("posts/view", {
    post
  });
});

module.exports = postRouter;

postRouter.post("/:postId/delete", isOwnerPost, async (req, res, next) => {
  const post = await Post.findById({ _id: req.params.postId });
  await post.remove();
  req.flash("success", "you had just delete post");
  res.redirect("/");
});

module.exports = postRouter;
