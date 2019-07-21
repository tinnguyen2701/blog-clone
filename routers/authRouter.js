const authRouter = require("express").Router();

authRouter.post("/register", (req, res, next) => {
  const errors = [];
  const { username, password } = req.body;
});

module.exports = authRouter;
