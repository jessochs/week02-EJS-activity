const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const projectRoute = require("./routes/projectRoute");
const utilities = require("./utilities/");
const session = require("express-session");
const flash = require('connect-flash');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false } // set to true if you are using https
}));

app.use(flash());
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

app.use(static);
app.get("/", utilities.handleErrors(baseController.buildHome));
app.use("/project", projectRoute);

app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'});
});

app.use(async (err, req, res, next) => {
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  const message = err.status == 404 ? err.message : 'Oh no! There was a crash. Maybe try a different route?';
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
  });
});

const port = process.env.PORT;
const host = process.env.HOST;

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});

