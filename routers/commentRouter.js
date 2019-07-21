const commentRouter = require("express").Router({ mergeParams: true });
const Comment = require("../models/commentModel");
const Post = require("../models/postModel");
const { isLoggedIn, checkOwnerComment } = require("../middlewares/index");

commentRouter.post("/", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findById({ _id: req.params.postId });

    const newComment = new Comment({
      text: req.body.text,
      author: {
        id: req.user._id,
        username: req.user.username
      }
    });
    await newComment.save();
    post.comments.push(newComment);
    await post.save();
    return res.redirect("back");
  } catch (error) {
    return res.redirect("back");
  }
});

commentRouter.post(
  "/:commentId/delete",
  checkOwnerComment,
  async (req, res) => {
    const comment = await Comment.findById(req.params.commentId);
    await comment.delete();
    res.redirect("back");
  }
);

module.exports = commentRouter;
