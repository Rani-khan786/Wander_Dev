const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

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
app.engine("ejs",ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname , "public")));
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

// new route
app.get("/listings/new",(req,res)=>{
  res.render("listings/new.ejs");
});


//Show route

app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

// create route
app.post("/listings",async(req,res)=>{
  // let {title,description,image,price,country,location} = req.body;
  // let listing = req.body;
  const newListing = new Listing(req.body);
  await newListing.save();
  res.redirect("/listings");
});

//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

// update route
app.put("/listings/:id" , async(req,res)=>{
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id , {...req.body});
  res.redirect("/listings");
});

// delete route
  app.delete("/listings/:id", async(req,res)=>{
     let { id } = req.params;
     let deletedListing =  await Listing.findOneAndDelete(id);
     console.log(deletedListing);
     res.redirect("/listings");
  });
// (Optional) Test route to insert one sample listing into DB
// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });
//   await sampleListing.save();
//   console.log("Sample listing was saved");
//   res.send("✅ Sample listing added successfully!");
// });

// Start server
app.listen(8080, () => {
  console.log("🚀 Server is listening on port 8080");
});
