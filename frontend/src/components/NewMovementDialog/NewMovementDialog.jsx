import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import "./NewMovementDialog.css";
import { jwtDecode } from "jwt-decode";

export default function NewMovementDialog({ visible, setVisible }) {
  const navigate = useNavigate();

  // Form State
  const [date, setDate] = useState(null);
  const [amount, setAmount] = useState(null);
  const [categoryCode, setCategoryCode] = useState(null);
  const [movementDate, setMovementDate] = useState(null);
  const [description, setDescription] = useState(null);
  const [movementName, setMovementName] = useState(null);

  // Category State
  const [mainCategories, setMainCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  useEffect(() => {
    console.log("Fetching main categories...");

    axios
      .get("http://localhost:8181/v1/categories/main")
      .then((response) => {
        setMainCategories(response.data);
        console.log("Main Categories -> ", response.data);
      })
      .catch((err) => {
        console.error("Error fetching main categories", err);
      });
  }, []);

  // Fetch subcategories when a main category is selected
  const handleMainCategoryChange = (category) => {
    setSelectedMainCategory(category);
    setSelectedSubcategory(null); // Reset subcategory when changing main category

    axios
      .get(`http://localhost:8181/v1/categories/subcategories/${category}`)
      .then((response) => {
        setSubcategories(response.data);
        console.log("Subcategories -> ", response.data);
      })
      .catch((err) => {
        console.error("Error fetching subcategories", err);
      });
  };

  const resetFormFields = () => {
    setDate(null);
    setAmount(null);
    setCategoryCode(null);
    setMovementDate(null);
    setDescription(null);
    setMovementName(null);
    setSelectedMainCategory(null);
    setSubcategories([]); // Clear subcategories when resetting
    setSelectedSubcategory(null);
  };

  const handleSubmit = () => {
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

      axios
        .post("http://localhost:8181/v1/new_movment", {
          amount: amount,
          movement_date: movementDate,
          category_code: selectedSubcategory.category_code, // Correct way to access the category_code
          user_id: userId,
          description: description,
          movement_name: movementName,
        })
        .then(() => {
          navigate("/dashboard");
        })
        .catch((err) => {
          console.error("Error creating new movement -> ", err);
        });
    }
    resetFormFields();
  };

  return (
    <Dialog
      visible={visible}
      modal
      onHide={() => {
        resetFormFields(); // Reset form when dialog closes
        setVisible(false);
      }}
    >
      <div className="dialog-container">
        <div className="secondary-dialog-container">
          <div className="single-input-container">
            <label htmlFor="amount" className="text-primary-50 font-semibold">
              Amount
            </label>
            <InputNumber
              value={amount}
              onValueChange={(e) => setAmount(e.value)}
              mode="currency"
              currency="EUR"
              locale="pt-PT"
              className="bg-white-alpha-20 border-none p-3 text-primary-50"
            />
          </div>
        </div>

        <div className="secondary-dialog-container">
          <div className="single-input-container">
            <label
              htmlFor="movementName"
              className="text-primary-50 font-semibold"
            >
              Movement Name
            </label>
            <InputText
              id="movementName"
              value={movementName}
              onChange={(e) => setMovementName(e.target.value)}
              className="bg-white-alpha-20 border-none p-3 text-primary-50"
            />
          </div>
          <div className="single-input-container">
            <label htmlFor="category" className="text-primary-50 font-semibold">
              Main Category
            </label>
            <Dropdown
              value={selectedMainCategory}
              onChange={(e) => handleMainCategoryChange(e.value)}
              options={mainCategories}
              optionLabel="category"
              className="bg-white-alpha-20 border-none p-3 text-primary-50"
              placeholder="Select Main Category"
            />
          </div>
        </div>

        <div className="secondary-dialog-container">
          <div className="single-input-container">
            <label
              htmlFor="subcategory"
              className="text-primary-50 font-semibold"
            >
              Subcategory
            </label>
            <Dropdown
              value={selectedSubcategory}
              onChange={(e) => {
                setSelectedSubcategory(e.value);
                console.log(e.value.category_code);
                
                setCategoryCode(e.value.category_code);
              }}
              options={subcategories}
              optionLabel="subcategory"
              className="bg-white-alpha-20 border-none p-3 text-primary-50"
              placeholder="Select Subcategory"
            />
          </div>
        </div>

        <div className="secondary-dialog-container">
          <div className="single-input-container">
            <label htmlFor="date" className="text-primary-50 font-semibold">
              Date
            </label>
            <Calendar
              value={movementDate}
              onChange={(e) => setMovementDate(e.value)}
              showButtonBar
              className="bg-white-alpha-20 border-none p-3 text-primary-50"
            />
          </div>
          <div className="single-input-container">
            <label
              htmlFor="description"
              className="text-primary-50 font-semibold"
            >
              Description
            </label>
            <InputText
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white-alpha-20 border-none p-3 text-primary-50"
            />
          </div>
        </div>

        <div className="dialog-btn-container flex align-items-center gap-2">
          <Button
            label="Cancel"
            onClick={() => {
              resetFormFields();
              setVisible(false);
            }}
            text
            className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"
          />
          <Button
            label="+ Add"
            onClick={() => {
              handleSubmit();
              setVisible(false);
            }}
            text
            className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"
          />
        </div>
      </div>
    </Dialog>
  );
}
