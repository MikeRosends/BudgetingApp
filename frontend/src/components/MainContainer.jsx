import { React, useEffect, useState } from "react";
import "./MainContainer.css";
import axios from "axios";
import { Link } from "react-router-dom";

// https://codepen.io/aybukeceylan/pen/OJRNbZp - inspiration

export const MainContainer = () => {
  const [message, setMessage] = useState("");
  const [accountAmount, setAccountAmount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:8181/v1/account_total_amount", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        res.data < 0 ? setAccountAmount(res.data) : setAccountAmount(0);
      });
  });

  // Function to test the protected route
  const handleTestProtectedRoute = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:8181/v1/test", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
            <p className="card-amount">{accountAmount} €</p>
            <Link to="/accounts">
              <button>
                <p>Check Movements</p>
              </button>
            </Link>
          </div>
          <div className="card">
            <p>Account 2</p>
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
