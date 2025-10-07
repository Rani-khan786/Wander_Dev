const mongoose = require("mongoose");
const { Schema } = mongoose;

// ✅ Define Listing Schema
const listingSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  image: {
    filename: {
      type: String,
      default: "default-image",
    },
    url: {
      type: String,
      default: "https://via.placeholder.com/400",
    },
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price must be positive"],
  },
  location: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    trim: true,
  },
});

// ✅ Create and export model
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;