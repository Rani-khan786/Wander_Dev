const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

// MongoDB connection URL
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Connect to MongoDB
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// Set EJS as the view engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Root route
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

// Route to display all listings
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

// New route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Show route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

// ✅ Create route (Fixed)
app.post(
  "/listings",
  wrapAsync(async (req, res, next) => {
    console.log("Incoming form data:", req.body);

    // Create new listing
    const newListing = new Listing(req.body.listing);

    // ✅ Handle nested image properly
    if (req.body.listing.image && req.body.listing.image.url) {
      newListing.image.url = req.body.listing.image.url;
      newListing.image.filename = "listingimage";
    }

    await newListing.save();
    console.log("✅ Saved listing:", newListing);

    res.redirect(`/listings/${newListing._id}`);
  })
);

// Edit route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

// ✅ Update route (Fixed)
app.put(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    console.log("Incoming edit data:", req.body);

    const listing = await Listing.findByIdAndUpdate(id, req.body.listing, {
      new: true,
      runValidators: true,
    });

    // ✅ Handle nested image update
    if (req.body.listing.image && req.body.listing.image.url) {
      listing.image.url = req.body.listing.image.url;
      listing.image.filename = "updated-image";
      await listing.save();
    }

    console.log("✅ Updated listing:", listing);
    res.redirect(`/listings/${listing._id}`);
  })
);

// Delete route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});

// No route matches for incoming request
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).send(message);
});

// Start server
app.listen(8080, () => {
  console.log("🚀 Server is listening on port 8080");
});
