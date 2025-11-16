// src/pages/CarUseState.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import CarCart from "./CarCart";

export default function CarUseState() {
  const [cars, setCars] = useState([]);
  const [cart, setCart] = useState([]);
  const [dateInputs, setDateInputs] = useState({}); // store date per carId

  useEffect(() => {
    fetchCars();
    fetchCart();
  }, []);

  const fetchCars = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/cars`);
      setCars(res.data.cars || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/cars/cart`);
      setCart(res.data.cartItems || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDateChange = (carId, value) => {
    setDateInputs((prev) => ({ ...prev, [carId]: value }));
  };

  const handleCheckAvailability = async (car) => {
    const journeyDate = dateInputs[car._id];
    if (!journeyDate) {
      alert("Please select a journey date first!");
      return;
    }

    // Validate not in the past
    const selectedDate = new Date(journeyDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      alert("Journey date cannot be in the past!");
      return;
    }

    try {
      // Backend will also check, but we pre-check quickly
      const res = await axios.get(`http://localhost:3000/api/cars/cart`);
      const booked = (res.data.cartItems || []).find(
        (item) => item.name === car.name && item.journeyDate === journeyDate
      );

      if (booked) {
        alert("This car is already booked on that date!");
        return;
      }

      const distanceInput = prompt("Enter journey distance (in km):", "10");
      const distance = Number(distanceInput);
      if (!distance || isNaN(distance) || distance < 10) {
        alert("Distance must be a valid number (minimum 10 km)");
        return;
      }

      if (
        !window.confirm(
          `Confirm booking ${car.name} for ${distance} km on ${journeyDate}?`
        )
      )
        return;

      // POST booking
      await axios.post(`http://localhost:3000/api/cars/cart/add`, {
        name: car.name,
        category: car.category,
        costPerKm: car.costPerKm,
        image: car.image,
        distance,
        journeyDate,
      });

      alert("Car booked successfully!");
      // refresh cart and reset only this car's input
      fetchCart();
      setDateInputs((prev) => ({ ...prev, [car._id]: "" }));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong!");
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Clear all bookings?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/cars/cart/clear`);
      fetchCart();
    } catch (err) {
      console.error(err);
      alert("Could not clear bookings");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Car Rental System</h2>
      <div className="row mt-5">
        {cars.map((car) => (
          <div className="col-md-4 mb-4" key={car._id}>
            <div className="card shadow-sm h-100">
              <img
                src={`http://localhost:3000/uploads/${car.image}`}
                className="card-img-top"
                alt={car.name}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{car.name}</h5>
                <p className="mb-1">
                  <b>Category:</b> {car.category}
                </p>
                <p className="mb-2">
                  <b>Cost:</b> ₹{car.costPerKm}/km
                </p>

                <div className="mb-3">
                  <label className="form-label small">Journey Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={dateInputs[car._id] || ""}
                    onChange={(e) => handleDateChange(car._id, e.target.value)}
                  />
                </div>

                <button
                  className="btn btn-primary mt-auto"
                  onClick={() => handleCheckAvailability(car)}
                >
                  Check & Book
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
 
      <CarCart cart={cart} onClearCart={handleClearCart} refresh={fetchCart} />
    </div>
  );
}
