const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");



const campgroundSchema = new Schema({
    title: {
        type: String,
        // required: true
    },
    image: {
        type: String
    },
    price: {
        type: Number,
        // required: true
    },
    description: {
        type: String,
        // required: true
    },
    location: {
        type: String,
        // required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

campgroundSchema.post("findOneAndDelete", async function (doc) {
    console.log("Deleted");
    console.log(doc);
    if (doc) {
        await Review.remove({ _id: { $in: doc.reviews } })
    }
})

module.exports = mongoose.model("Campground", campgroundSchema);