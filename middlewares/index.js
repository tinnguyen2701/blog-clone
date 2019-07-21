const Post = require("../models/postModel");
const Comment = require("../models/commentModel");

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("error", "You must be login");
    res.redirect("/auth/login");
  }
};

exports.isOwnerPost = async (req, res, next) => {
  if (req.isAuthenticated()) {
    try {
      const post = await Post.findById(req.params.postId);
      if (!post) {
        req.flash("error", "Post not found");
        return res.redirect("back");
      } else {
        if (post.userId.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "you dont have permission");
          return res.redirect("back");
        }
      }
    } catch (error) {
      req.flash("error", "Something went wrong");
      return res.redirect("back");
    }
  } else {
    req.flash("error", "you must be login");
    res.redirect("back");
  }
};

exports.checkOwnerComment = async (req, res, next) => {
  if (req.isAuthenticated()) {
    try {
      const post = await Post.findById(req.params.postId);
      const comment = await Comment.findById(req.params.commentId);

      if (!post || !comment) {
        req.flash("error", "some thing not found");
        return res.redirect("back");
      } else {
        if (
          comment.author.id.equals(req.user._id) ||
          post.userId.equals(req.user._id)
        )
          next();
        else {
          req.flash("you dont have permission");
          return res.redirect("back");
        }
      }
    } catch (error) {
      req.flash("some thing went wrong");
      return res.redirect("back");
    }
  } else {
    req.flash("error", "you must be login");
    return res.redirect("back");
  }
};
