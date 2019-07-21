const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const flash = require("connect-flash");
const session = require("express-session");

const homeRouter = require("./routers/homeRouter");
const authRouter = require("./routers/authRouter");
const postRouter = require("./routers/postRouter");
const commentRouter = require("./routers/commentRouter");

// config environment
dotenv.config();

// init app
const app = express();

// connect mongoose
mongoose
  .connect(process.env.MONGODB_URL, { useNewUrlParser: true })
  .then(() => console.log("connect db"));

// middleware
app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
  })
);
app.use(flash());

// set up passport
require("./config/passport")(app);

// customize middleware
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// routers
app.use("/", homeRouter);
app.use("/auth", authRouter);
app.use("/posts", postRouter);
app.use("/posts/:postId/comments", commentRouter);

// start server
app.listen(process.env.PORT, () =>
  console.log("server is running on port " + process.env.PORT)
);
