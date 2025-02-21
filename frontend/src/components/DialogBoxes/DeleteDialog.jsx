import React from "react";
import { Dialog } from "primereact/dialog";
import axios from "axios";
import "./dialogbox.css";

export default function DeleteDialog({ visible, movement, onHide, onDelete }) {
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleDelete = () => {
    axios
      .delete(`${apiUrl}/v1/movement/${movement.id}`)
      .then(() => {
        onDelete(movement.id); // Remove movement from state
        onHide(); // Close dialog
      })
      .catch((err) => console.error("Error deleting movement", err));
  };

  return (
    <Dialog visible={visible} onHide={onHide} header="Confirm Delete">
      <p>Are you sure you want to delete this movement?</p>
      <div className="dialog-btn-container">
        <button onClick={onHide}>Cancel</button>
        <button onClick={handleDelete} className="btn-delete">
          Delete
        </button>
      </div>
    </Dialog>
  );
}
