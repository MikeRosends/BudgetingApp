import { React, useEffect, useState } from "react";
import "./MainContainer.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import NewMovementDialog from "../NewMovementDialog/NewMovementDialog";

export default function MainContainer() {
  const [message, setMessage] = useState("");
  const [accountAmount, setAccountAmount] = useState(0);
  const [dialogVisible, setDialogVisible] = useState(false); // Control dialog visibility

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:8181/v1/user_total_amount", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAccountAmount(res.data > 0 ? res.data : 0);
      });
  }, []); // Added empty dependency array to avoid infinite loop

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
      setMessage(err.response?.data?.message || "Failed to access protected route");
    }
  };

  return (
    <div className="main-container">
      <div className="header">
        <p className="header-title">Miguel Rosendo</p>
        <p className="header-date">21<sup>st</sup> of November</p>
      </div>

      <div className="first-container">
        <div className="individual-stat">
          <h2 className="card-amount">{accountAmount} €</h2>
          <p>balance</p>
        </div>
      </div>

      <div className="second-container">
        <div className="card-row">
          <div className="card">
            <Link to="/movements">
              <button>
                <p>Check Movements</p>
              </button>
            </Link>
          </div>
          <div className="card">
            <Button 
              id="new-movement" 
              onClick={() => setDialogVisible(true)}
            >
              <p>+ New Movement</p>
            </Button>
          </div>
        </div>
      </div>

      <NewMovementDialog 
        visible={dialogVisible} 
        setVisible={setDialogVisible} 
      />
    </div>
  );
}
