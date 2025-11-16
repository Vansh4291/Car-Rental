// routes/carRoutes.js
const express = require("express");
const Car = require("../model/Car");
const CarCart = require("../model/CarCart");

const router = express.Router();

// GET /api/cars
router.get("/", async (req, res) => {
  try {
    const cars = await Car.find();
    res.json({ success: true, cars });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

//POST /api/cars/add
router.post("/add", async (req, res) => {
  try {
    const { name, category, costPerKm, image } = req.body;
    if (!name || !category || !costPerKm || !image) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }
    const newCar = new Car({ name, category, costPerKm, image });
    await newCar.save();
    res.json({ success: true, car: newCar });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

//GET /api/cars/cart
router.get("/cart", async (req, res) => {
  try {
    const cartItems = await CarCart.find().sort({ createdAt: -1 });
    res.json({ success: true, cartItems });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

//POST /api/cars/cart/add
router.post("/cart/add", async (req, res) => {
  try {
    const { name, category, costPerKm, image, distance, journeyDate } =
      req.body;
    if (!name || !journeyDate || !distance) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Check if same car is already booked on the same date
    // We compare the raw date string (yyyy-mm-dd) to keep it simple & consistent with frontend input
    const existing = await CarCart.findOne({ name, journeyDate });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `This car is already booked on ${journeyDate}.`,
      });
    }

    const newItem = new CarCart({
      name,
      category,
      costPerKm,
      image,
      distance,
      journeyDate,
    });

    await newItem.save();
    res.json({
      success: true,
      message: "Car booked successfully",
      cartItem: newItem,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

//DELETE /api/cars/cart/delete/:id
router.delete("/cart/delete/:id", async (req, res) => {
  try {
    const deleted = await CarCart.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    res.json({ success: true, message: "Item removed" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// UPDATE distance in Cart
router.put("/cart/update/:id", async (req, res) => {
  try {
    const { distance } = req.body;

    if (!distance || distance < 1) {
      return res.status(400).json({
        success: false,
        message: "Distance must be a positive number",
      });
    }

    const updated = await CarCart.findByIdAndUpdate(
      req.params.id,
      { distance },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({ success: true, booking: updated });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error: " + err.message });
  }
});

//DELETE /api/cars/cart/clear
router.delete("/cart/clear", async (req, res) => {
  try {
    await CarCart.deleteMany({});
    res.json({ success: true, message: "All bookings cleared" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
