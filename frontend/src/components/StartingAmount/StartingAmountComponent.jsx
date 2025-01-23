import React, { useEffect, useState } from "react";
import axios from "axios";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import "./StartingAmountComponent.css";
import NavbarComponent from "../NavbarComponent/NavbarComponent";
import SidebarComponent from "../SidebarComponent/SidebarComponent";

export default function StartingAmountComponent() {
  const [startingAmount, setStartingAmount] = useState(null); // Starting amount value
  const [isEditing, setIsEditing] = useState(false); // Edit mode state
  const [loading, setLoading] = useState(true); // Loading state
  const [errorMessage, setErrorMessage] = useState(""); // Error message state

  const fetchStartingAmount = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get("http://localhost:8181/v1/starting_amount", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.starting_amount != null) {
        setStartingAmount(response.data.starting_amount);
      } else {
        setStartingAmount(null); // No starting amount exists
      }
    } catch (err) {
      console.error("Error fetching starting amount:", err);
      setErrorMessage("Failed to fetch starting amount.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);

      const endpoint = startingAmount === null ? "post" : "put";
      const response = await axios[endpoint](
        "http://localhost:8181/v1/starting_amount",
        { starting_amount: startingAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStartingAmount(response.data.starting_amount);
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving starting amount:", err);
      setErrorMessage("Failed to save starting amount.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStartingAmount();
  }, []);

  return (
    <div className="starting-amount-container">
          <SidebarComponent />
          <NavbarComponent />
      <h2>Starting Amount</h2>

      {loading ? (
        <p>Loading...</p>
      ) : errorMessage ? (
        <p className="error-message">{errorMessage}</p>
      ) : (
        <div>
          {isEditing ? (
            <div className="input-container">
              <label htmlFor="startingAmount">Enter Starting Amount:</label>
              <InputNumber
                id="startingAmount"
                value={startingAmount}
                onValueChange={(e) => setStartingAmount(e.value)}
                mode="currency"
                currency="EUR"
                locale="en-US"
              />
              <div className="button-container">
                <Button
                  label="Save"
                  onClick={handleSave}
                  className="p-button-success"
                />
                <Button
                  label="Cancel"
                  onClick={() => setIsEditing(false)}
                  className="p-button-secondary"
                />
              </div>
            </div>
          ) : (
            <div className="display-container">
              <p>
                Starting Amount:{" "}
                <span className="amount-display">
                  {startingAmount !== null
                    ? `${startingAmount.toFixed(2)} €`
                    : "Not Set"}
                </span>
              </p>
              <Button
                label={startingAmount === null ? "Add Starting Amount" : "Edit"}
                onClick={() => setIsEditing(true)}
                className="p-button-primary"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
