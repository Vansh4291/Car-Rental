const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    costPerKm: { type: Number, required: true },
    image: { type: String, required: true }, // filename stored, served from /uploads/<filename>
  },
  { timestamps: true }
);

module.exports = mongoose.model("Car", carSchema, "clc_cars");
