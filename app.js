const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");

const Campground = require("./models/campground");

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

app.get(`/`, (req, res) => {
  res.render(`home`);
});

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post("/campgrounds", async (req, res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});

app.get("/campgrounds/:id", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/show", { campground });
});

app.get("/campgrounds/:id/edit", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
});

app.put("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  res.redirect(`/campgrounds/${campground._id}`);
});

app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is Listening on port ${PORT}`);
});
