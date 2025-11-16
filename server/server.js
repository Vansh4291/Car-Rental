// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// serve uploaded images/files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// mount routes
app.use("/api/cars", require("./routes/carRoutes"));

// mongo
mongoose
  .connect("mongodb://127.0.0.1:27017/car_rental_db")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Mongo Error", err));

app.listen(3000, () => console.log(`Server running at http://localhost:3000`));
