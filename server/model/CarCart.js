const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    name: String,
    category: String,
    costPerKm: Number,
    image: String,
    distance: Number,
    // store date as yyyy-mm-dd string (from <input type="date">)
    journeyDate: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CarCart", cartSchema, "clc_car_cart");
