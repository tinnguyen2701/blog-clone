const authRouter = require("express").Router();
const passport = require("passport");
const User = require("../models/userModel");

authRouter.get("/register", (req, res, next) => {
  res.render("auth/register");
});

authRouter.get("/login", (req, res, next) => {
  res.render("auth/login");
});

authRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) {
      req.flash("error", "username is used");
      return res.redirect("/auth/register");
    }
    const newUser = new User({ username, password });
    await newUser.save();
    req.flash("success", "welcome to login");
    return res.redirect("/auth/login");
  } catch (error) {
    req.flash("error", "something went wrong");
    return res.redirect("/auth/register");
  }
});

authRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    successFlash: true
  })
);

authRouter.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success", "you was logout successful");
  return res.redirect("/");
});

module.exports = authRouter;
