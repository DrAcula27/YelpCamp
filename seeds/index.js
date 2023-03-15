const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

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

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "https://source.unsplash.com/collection/483251",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti illo dicta qui ea perspiciatis sapiente sequi odio necessitatibus, aspernatur sint deserunt consequatur voluptatum ut impedit expedita ratione rem laboriosam quas.",
      price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
