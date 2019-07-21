const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const authRouter = require("./routers/authRouter");

// config environment
dotenv.config();

// init app
const app = express();

// connect mongoose
mongoose
  .connect(process.env.MONGODB_URL, { useNewUrlParser: true })
  .then(() => console.log("connect db"));

// middleware
app.set(views, "./views");
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// routers
app.use(authRouter, "/auth");

app.listen(process.env.PORT, () =>
  console.log("server is running on port " + process.env.PORT)
);
