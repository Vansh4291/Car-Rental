import React from "react";
import axios from "axios";



export default function CarCart({ cart = [], onClearCart, refresh }) {
  
  // remove a booking
  const removeItem = async (id) => {
    if (!window.confirm("Remove this booking?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/cars/cart/delete/${id}`);
      refresh();
    } catch (err) {
      console.error(err);
      alert("Could not delete item");
    }
  };

  // update distance
  const updateKm = async (id, newKm) => {
    const km = Number(newKm);
    if (!km || km < 1) return;

    try {
      await axios.put(`http://localhost:3000/api/cars/cart/update/${id}`, { distance: km });
      refresh();
    } catch (err) {
      console.error(err);
      alert("Could not update km");
    }
  };

  const total = cart.reduce(
    (sum, i) => sum + i.distance * i.costPerKm,
    0
  );

  return (
    <div className="mt-4">
      <h3 className="mb-3">Your Bookings</h3>

      {cart.length === 0 ? (
        <p>No bookings available.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div className="card mb-3 p-3 shadow-sm" key={item._id}>
              <div className="d-flex align-items-center">
                
                <img
                  src={`http://localhost:3000/uploads/${item.image}`}
                  width="120"
                  height="80"
                  className="rounded me-3"
                />

                <div className="flex-grow-1">
                  <h5 className="mb-1">{item.name}</h5>
                  <p className="mb-1"><b>Date:</b> {item.journeyDate}</p>
                  <p className="mb-1"><b>Cost per km:</b> ₹{item.costPerKm}</p>

                  <div className="d-flex align-items-center mt-2">
                    <b className="me-2">Km:</b>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      style={{ width: "90px" }}
                      value={item.distance}
                      onChange={(e) => updateKm(item._id, e.target.value)}
                    />
                  </div>

                  <p className="mt-2 fw-bold text-success">
                    Total: ₹{item.distance * item.costPerKm}
                  </p>
                </div>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => removeItem(item._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="text-end fw-bold fs-5 mt-3">
            Grand Total: ₹{total}
          </div>

          <div className="mt-3">
            <button className="btn btn-danger" onClick={onClearCart}>
              Clear All
            </button>
            <button
              className="btn btn-success ms-2"
              onClick={() => (window.location.href = "/invoice")}
            >
              View Invoices
            </button>
          </div>
        </>
      )}
    </div>
  );
}
