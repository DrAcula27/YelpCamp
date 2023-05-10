const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");
require("dotenv").config();

const COLLECTION = "YelpCamp";
let connectionString = `mongodb+srv://${process.env.MONGODB}/${COLLECTION}?retryWrites=true&w=majority`;

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
      // seeds db with author of every campground as the admin user, dracula
      author: "643487992ebc6dbfbb16c217",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti illo dicta qui ea perspiciatis sapiente sequi odio necessitatibus, aspernatur sint deserunt consequatur voluptatum ut impedit expedita ratione rem laboriosam quas.",
      price,
      geometry: { type: "Point", coordinates: [-113.1331, 47.0202] },
      images: [
        {
          url: "https://res.cloudinary.com/dnt5ntba2/image/upload/v1681487637/YelpCamp/aocusfsy7qmarkesejgu.jpg",
          filename: "YelpCamp/aocusfsy7qmarkesejgu",
        },
        {
          url: "https://res.cloudinary.com/dnt5ntba2/image/upload/v1683727993/YelpCamp/e5np990ev4uds0yjkypz.jpg",
          filename: "YelpCamp/e5np990ev4uds0yjkypz",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
