import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import "./dialogbox.css";
import { jwtDecode } from "jwt-decode";

export default function NewMovementDialog({
  visible,
  setVisible,
  defaultType,
}) {
  const navigate = useNavigate();

  // Form State
  const [amount, setAmount] = useState(null);
  const [categoryCode, setCategoryCode] = useState(null);
  const [movementDate, setMovementDate] = useState(null);
  const [description, setDescription] = useState(null);
  const [movementName, setMovementName] = useState(null);
  const [type, setType] = useState(defaultType); // Set type from prop

  // Category State
  const [mainCategories, setMainCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  useEffect(() => {
    setType(defaultType); // Set the type when the dialog opens
  }, [defaultType, visible]); // Reset type when the dialog becomes visible

  useEffect(() => {
    axios
      .get("http://localhost:8181/v1/categories/main")
      .then((response) => {
        setMainCategories(response.data);
      })
      .catch((err) => {
        console.error("Error fetching main categories", err);
      });
  }, []);

  const handleMainCategoryChange = (category) => {
    setSelectedMainCategory(category);
    setSelectedSubcategory(null); // Reset subcategory when changing main category

    axios
      .get(`http://localhost:8181/v1/categories/subcategories/${category}`)
      .then((response) => {
        setSubcategories(response.data);
      })
      .catch((err) => {
        console.error("Error fetching subcategories", err);
      });
  };

  const resetFormFields = () => {
    setAmount(null);
    setCategoryCode(null);
    setMovementDate(null);
    setDescription(null);
    setMovementName(null);
    setSelectedMainCategory(null);
    setSubcategories([]); // Clear subcategories when resetting
    setSelectedSubcategory(null);
    setType(defaultType); // Reset type to passed value
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      if (
        !amount ||
        !movementDate ||
        !selectedMainCategory ||
        !selectedSubcategory
      ) {
        alert("Please fill all the required fields.");
        return;
      }

      console.log("Data being sent to backend:", {
        amount,
        movement_date: movementDate,
        category_code: selectedSubcategory?.category_code,
        user_id: userId,
        description,
        movement_name: movementName,
        type,
      });

      axios
        .post("http://localhost:8181/v1/new_movment", {
          amount,
          movement_date: movementDate,
          category_code: selectedSubcategory.category_code,
          user_id: userId,
          description,
          movement_name: movementName,
          type,
        })
        .then(() => {
          resetFormFields(); // Reset the form fields after successful request
          setVisible(false); // Close the dialog box
          navigate("/dashboard"); // Optional: Navigate after closing dialog
        })
        .catch((err) => {
          console.error("Error creating new movement -> ", err);
        });
    }
  };

  return (
    <Dialog
      visible={visible}
      modal
      onHide={() => {
        resetFormFields();
        setVisible(false);
      }}
    >
      <div className="dialog-container">
        <div className="secondary-dialog-container">
          <div className="single-input-container">
            <label htmlFor="amount">Amount</label>
            <InputNumber
              value={amount}
              onValueChange={(e) => setAmount(e.value)}
              mode="currency"
              currency="EUR"
              locale="pt-PT"
            />
          </div>
        </div>

        <div className="secondary-dialog-container">
          <div className="single-input-container">
            <label htmlFor="movementName">Movement Name</label>
            <InputText
              id="movementName"
              value={movementName}
              onChange={(e) => setMovementName(e.target.value)}
            />
          </div>
          <div className="single-input-container">
            <label htmlFor="category">Main Category</label>
            <Dropdown
              value={selectedMainCategory}
              onChange={(e) => handleMainCategoryChange(e.value)}
              options={mainCategories}
              optionLabel="category"
              placeholder="Select Main Category"
            />
          </div>
        </div>

        <div className="secondary-dialog-container">
          <div className="single-input-container">
            <label htmlFor="subcategory">Subcategory</label>
            <Dropdown
              value={selectedSubcategory}
              onChange={(e) => {
                setSelectedSubcategory(e.value);
                setCategoryCode(e.value.category_code);
              }}
              options={subcategories}
              optionLabel="subcategory"
              placeholder="Select Subcategory"
            />
          </div>
        </div>

        <div className="secondary-dialog-container">
          <div className="single-input-container">
            <label htmlFor="date">Date</label>
            <Calendar
              value={movementDate}
              onChange={(e) => setMovementDate(e.value)}
              showButtonBar
            />
          </div>
          <div className="single-input-container">
            <label htmlFor="description">Description</label>
            <InputText
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="dialog-btn-container">
          <Button
            label="Cancel"
            onClick={() => {
              resetFormFields();
              setVisible(false);
            }}
            text
          />
          <Button label="+ Add" onClick={handleSubmit} text />
        </div>
      </div>
    </Dialog>
  );
}
