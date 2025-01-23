import { React, useEffect, useState } from "react";
import "./MainContainer.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import NewMovementDialog from "../DialogBoxes/NewMovementDialog";

export default function MainContainer() {
  const [message, setMessage] = useState("");
  const [accountAmount, setAccountAmount] = useState(0);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [movementType, setMovementType] = useState(1); // To store deposit (1) or expense (-1)

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:8181/v1/user_total_amount", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // Format the total amount to two decimal places        
        setAccountAmount(parseFloat(res.data.totalAmount.total_amount).toFixed(2));
      });
  }, []);

  const openNewMovementDialog = (type) => {
    setMovementType(type); // Set type when opening the dialog
    setDialogVisible(true);
  };

  return (
    <div className="main-container">
      <div className="header">
        <p className="header-title">Miguel Rosendo</p>
        <p className="header-date">21<sup>st</sup> of November</p>
      </div>

      <div className="first-container">
        <div className="individual-stat">
          {/* Ensure consistent formatting */}
          <h2 className="card-amount">{`${accountAmount} €`}</h2>
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
              id="add-deposit"
              className="p-button-success"
              onClick={() => openNewMovementDialog(1)} // Deposit
            >
              <p>+ Add Deposit</p>
            </Button>
          </div>
          <div className="card">
            <Button
              id="add-expense"
              className="p-button-danger"
              onClick={() => openNewMovementDialog(-1)} // Expense
            >
              <p>+ Add Expense</p>
            </Button>
          </div>
        </div>
      </div>

      <NewMovementDialog
        visible={dialogVisible}
        setVisible={setDialogVisible}
        defaultType={movementType} // Pass type (1 or -1)
      />
    </div>
  );
}
