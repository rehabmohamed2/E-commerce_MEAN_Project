const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const productRoutes = require("./routes/product");
const categoryRoutes = require("./routes/category");
const cartRoutes = require("./routes/cart");
const userRoutes = require("./routes/user");
require('dotenv').config();

const server = express();
server.use(cors());
server.use(express.json()); 

  

mongoose.connect('mongodb+srv://mostafa:1234@cluster0.icfhj.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log("Error connecting to DB", err);
  });

// Use routes
server.use("/products", productRoutes);
server.use("/categories", categoryRoutes);
server.use("/cart", cartRoutes);
server.use("/users", userRoutes);


server.listen(5001, function () {
  console.log("Server running ");
});