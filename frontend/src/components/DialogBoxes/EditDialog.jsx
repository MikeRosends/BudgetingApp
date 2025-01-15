import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import "./dialogbox.css";

export default function EditDialog({ visible, movement, onHide, onUpdate }) {
  const [editedMovement, setEditedMovement] = useState(movement || {});
  const [mainCategories, setMainCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  useEffect(() => {
    if (movement) {
      setEditedMovement(movement);
      setSelectedMainCategory(movement.category || null);
      setSelectedSubcategory(movement.subcategory || null);

      fetchMainCategories();
      if (movement.category) {
        fetchSubcategories(movement.category);
      }
    }
  }, [movement]);

  const fetchMainCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8181/v1/categories/main");
      setMainCategories(response.data);
    } catch (err) {
      console.error("Error fetching main categories", err);
    }
  };

  const fetchSubcategories = async (category) => {
    try {
      const response = await axios.get(`http://localhost:8181/v1/categories/subcategories/${category}`);
      setSubcategories(response.data);
    } catch (err) {
      console.error("Error fetching subcategories", err);
    }
  };

  const handleMainCategoryChange = (category) => {
    setSelectedMainCategory(category);
    setSelectedSubcategory(null);
    setEditedMovement({ ...editedMovement, category, subcategory: null });
    fetchSubcategories(category);
  };

  const handleSubcategoryChange = (subcategory) => {
    setSelectedSubcategory(subcategory);
    const subcategoryDetails = subcategories.find((s) => s.subcategory === subcategory);
    setEditedMovement({ ...editedMovement, subcategory, category_code: subcategoryDetails?.category_code });
  };

  const handleInputChange = (key, value) => {
    setEditedMovement({ ...editedMovement, [key]: value });
  };

  const handleSubmit = () => {
    const updatedMovement = {
      ...editedMovement,
      category: selectedMainCategory,
      subcategory: selectedSubcategory,
      category_code: editedMovement.category_code, // Send category_code
    };

    axios
      .put(`http://localhost:8181/v1/movement/${editedMovement.id}`, updatedMovement)
      .then((response) => {
        if (response.data) {
          onUpdate(response.data); // Pass updated movement to `onUpdate`
        }
      })
      .catch((err) => console.error("Error updating movement", err));
  };

  return (
    <Dialog visible={visible} onHide={onHide} header="Edit Movement">
      <div className="form-group">
        <label>Amount</label>
        <InputNumber
          value={editedMovement.amount}
          onValueChange={(e) => handleInputChange("amount", e.value)}
          mode="currency"
          currency="EUR"
          locale="pt-PT"
        />
      </div>
      <div className="form-group">
        <label>Movement Name</label>
        <InputText
          value={editedMovement.movement_name || ""}
          onChange={(e) => handleInputChange("movement_name", e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Movement Date</label>
        <Calendar
          value={
            editedMovement.movement_date
              ? new Date(editedMovement.movement_date)
              : null
          }
          onChange={(e) => handleInputChange("movement_date", e.value)}
          showButtonBar
        />
      </div>
      <div className="form-group">
        <label>Main Category</label>
        <Dropdown
          value={selectedMainCategory}
          onChange={(e) => handleMainCategoryChange(e.value)}
          options={mainCategories}
          optionLabel="category"
          placeholder="Select Main Category"
        />
      </div>
      <div className="form-group">
        <label>Subcategory</label>
        <Dropdown
          value={selectedSubcategory}
          onChange={(e) => handleSubcategoryChange(e.value)}
          options={subcategories.map((s) => s.subcategory)}
          placeholder="Select Subcategory"
        />
      </div>
      <div className="dialog-btn-container">
        <button className="btn-cancel" onClick={onHide}>
          Cancel
        </button>
        <button className="btn-save" onClick={handleSubmit}>
          Save
        </button>
      </div>
    </Dialog>
  );
}
