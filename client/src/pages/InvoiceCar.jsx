import React, { useEffect, useState } from "react";
import axios from "axios";

export default function InvoiceCar() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/cars/cart`);
      if (res.data.success) {
        setOrders(res.data.cartItems);
      }
    } catch (err) {
      console.error("Failed to load invoice data:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container mt-4">

      <h2 className="fw-bold mb-4">Car Rental Invoices</h2>

      {orders.length === 0 ? (
        <div className="alert alert-warning">No bookings available.</div>
      ) : (
        orders.map((order, index) => (
          <div className="card shadow-sm mb-4" key={order._id}>

            <div className="card-header bg-dark text-white d-flex justify-content-between">
              <h5 className="mb-0">Invoice #{index + 1}</h5>
              <span>{new Date(order.createdAt).toLocaleString()}</span>
            </div>

            <div className="card-body">

              <div className="row mb-3 align-items-center">
                <div className="col-md-3">
                  <img
                    src={`http://localhost:3000/uploads/${order.image}`}
                    className="img-fluid rounded"
                    alt={order.name}
                  />
                </div>
                <div className="col-md-9">
                  <h4 className="fw-bold">{order.name}</h4>
                  <p className="mb-0"><b>Category:</b> {order.category}</p>
                  <p className="mb-0"><b>Journey Date:</b> {order.journeyDate}</p>
                  <p className="mb-0"><b>Cost Per Km:</b> ₹{order.costPerKm}</p>
                  <p className="mb-0"><b>Distance:</b> {order.distance} km</p>
                </div>
              </div>

              <table className="table table-bordered text-center">
                <thead className="table-light">
                  <tr>
                    <th>Distance</th>
                    <th>Cost/km</th>
                    <th>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{order.distance} km</td>
                    <td>₹{order.costPerKm}</td>
                    <td className="fw-bold text-success">
                      ₹{order.distance * order.costPerKm}
                    </td>
                  </tr>
                </tbody>
              </table>

            </div>
          </div>
        ))
      )}

    </div>
  );
}
