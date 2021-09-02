const Campground = require("../Models/campground")
const Cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/YelpCamp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Database connected!");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const randomPrice = Math.floor(Math.random() * 50);
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${Cities[random1000].city},${Cities[random1000].state}`,
            image: `https://source.unsplash.com/collection/483251`,
            description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.Aliquid ut dolores dolorum libero pariatur ipsa consequatur? Similique blanditiis dolorum veniam ex amet quidem voluptatibus, consequuntur sit voluptatum, officia quasi voluptatem!",
            price: randomPrice,
            owner: "610e4dddbb4ed91c503055bd"
        })
        await camp.save();
    }
}
seedDB();