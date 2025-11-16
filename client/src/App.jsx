import React from "react";
import './App.css';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import CarUseState from "./pages/CarUseState";
import CarCart from "./pages/CarCart";
import InvoiceCar from "./pages/InvoiceCar";

const App = () => {
  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link to="/" className="navbar-brand">Car Rental</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/" className="nav-link">Cars</Link>
              </li>
               <li className="nav-item">
                <Link to="/invoice" className="nav-link">Invoice</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<CarUseState />} />
        <Route path="/cart" element={<CarCart />} />
        <Route path="/invoice-car" element={<InvoiceCar />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
