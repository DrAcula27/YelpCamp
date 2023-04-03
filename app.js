const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");

const ExpressError = require("./utilities/ExpressError");

const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

const COLLECTION = "YelpCamp";
let connectionString = `mongodb+srv://perscholasuser:tRlCgTfk71FOzp6p@mongosetupcluster.muoiuud.mongodb.net/${COLLECTION}?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "db connection error: "));
db.once("open", () => {
  console.log(`connected to MongoDB collection: ${COLLECTION}`);
});

const app = express();

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

app.get(`/`, (req, res) => {
  res.render(`home`);
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(statusCode).render("error", { err });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is Listening on port ${PORT}`);
});
