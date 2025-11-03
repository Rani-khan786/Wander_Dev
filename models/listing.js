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
      default: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
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

// ✅ Virtual property to handle nested image URLs
listingSchema.virtual("imageUrl").get(function () {
  return this.image?.url?.url || this.image?.url || "";
});


// ✅ Create and export model
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;