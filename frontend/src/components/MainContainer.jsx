import { React, useState } from "react";
import "./MainContainer.css";
import axios from "axios";

// https://codepen.io/aybukeceylan/pen/OJRNbZp - inspiration

export const MainContainer = () => {
  const [message, setMessage] = useState("");

  // Function to test the protected route
  const handleTestProtectedRoute = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:8181/v1/test", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data); // Log the response to verify user_id and other data
      setMessage(`Protected Route Response: ${JSON.stringify(res.data)}`);
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message || "Failed to access protected route"
      );
    }
  };

  return (
    <div className="main-container">
      <div className="header">
        <p className="header-title">Miguel Rosendo</p>
        <p className="header-date">
          21<sup>st</sup> of november
        </p>
      </div>
      {/* Button to test the protected route */}
      <button type="button" onClick={handleTestProtectedRoute}>
        Test Protected Route
      </button>
      <div className="main-stats">
        <div className="individual-stat">
          <h2>45</h2>
          <p>In progress</p>
        </div>
        <div className="individual-stat">
          <h2>15</h2>
          <p>Upcoming</p>
        </div>
        <div className="individual-stat">
          <h2>60</h2>
          <p>Total projects</p>
        </div>
      </div>
      <div className="cards-container">
        <div className="card-row">
          <div className="card">
            <p>Account 1</p>
            <p className="card-amount">345 €</p>
            <button>
              <p>Check Movements</p>
            </button>
          </div>
          <div className="card">
            <p>Account 2</p>
            <p className="card-amount">345 €</p>
            <button>
              <p>Check Movements</p>
            </button>
          </div>
          <div className="card">
            <p>Account 3</p>
            <p className="card-amount">345 €</p>
            <button>
              <p>Check Movements</p>
            </button>
          </div>
        </div>
        <div className="card-row">
          <div className="card">
            <p>Account 4</p>
            <p className="card-amount">345 €</p>
            <button>
              <p>Check Movements</p>
            </button>
          </div>
          <div className="card">
            <p>Account 5</p>
            <p className="card-amount">345 €</p>
            <button>
              <p>Check Movements</p>
            </button>
          </div>
          <div className="card">
            <p>Account 6</p>
            <p className="card-amount">345 €</p>
            <button>
              <p>Check Movements</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
