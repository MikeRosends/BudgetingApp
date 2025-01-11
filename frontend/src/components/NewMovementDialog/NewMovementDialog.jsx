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
import { longFormatters } from "date-fns";

export default function NewMovementDialog({ visible, setVisible }) {
  const navigate = useNavigate();

  const [date, setDate] = useState(null);
  const [amount, setAmount] = useState(null);
  const [categoryCode, setCategoryCode] = useState(null);
  const [categoryName, setCategoryName] = useState(null);
  const [movementDate, setMovementDate] = useState(null);
  const [description, setDescription] = useState(null);
  const [movementName, setMovementName] = useState(null);

  const [groupedCategories, setGroupedCategories] = useState([]);
  const [selectedMovementCategory, setSelectedMovementCategory] =
    useState(null);

  const [movementSubCategories, setMovementSubCategories] = useState([]);
  const [selectedMovementSubCategory, setSelectedMovementSubCategory] =
    useState(null);

  useEffect(() => {
    console.log("calling useEffect");

    axios
      .get("http://localhost:8181/v1/movement_categories")
      .then((categories) => {
        setGroupedCategories(categories.data);
        console.log("CATEGORIES -> ", categories.data);
      })
      .catch((err) => {
        console.error("Error getting movement categories", err);
      });
  }, []);

  const handleSubmit = (e) => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      axios
        .post("http://localhost:8181/v1/new_movment", {
          amount: amount,
          movement_date: movementDate,
          category_code: categoryCode,
          user_id: userId,
          description: description,
          movement_name: movementName,
        })
        .then(() => {
          navigate("/dashboard");
        })
        .catch((err) => {
          console.error("Error creating new movemet -> ", err);
        });
    }
  };

  return (
    <Dialog
      visible={visible}
      modal
      onHide={() => setVisible(false)} // triggered when clicking outside or pressing "X"
    >
      <div
        className="dialog-container"
        style={{
          borderRadius: "12px",
          backgroundImage:
            "radial-gradient(circle at left top, var(--primary-400), var(--primary-700))",
        }}
      >
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
              label="Amount"
              className="bg-white-alpha-20 border-none p-3 text-primary-50"
            ></InputNumber>
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
              label="Mmovement Name"
              value={movementName}
              onChange={(e) => setMovementName(e.target.value)}
              className="bg-white-alpha-20 border-none p-3 text-primary-50"
            ></InputText>
          </div>
          <div className="single-input-container">
            <label htmlFor="category" className="text-primary-50 font-semibold">
              Category
            </label>
            <Dropdown
              value={selectedMovementCategory}
              onChange={(e) => {
                console.log(e.value);
                
                setSelectedCategoryCode(e.value)
              }}
              options={groupedCategories}
              optionLabel="category"
              optionValue="category"
              optionGroupLabel="category"
              optionGroupChildren="subcategory"
              optionGroupTemplate={(option) => (
                <div className="flex align-items-center">
                  <strong>{option.category}</strong>
                </div>
              )}
              itemTemplate={(option) => (
                <div className="flex align-items-center">
                  <div>{option.label}</div> {/* Render subcategory label */}
                </div>
              )}
              className="bg-white-alpha-20 border-none p-3 text-primary-50"
            ></Dropdown>
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
            ></Calendar>
          </div>
          <div className="single-input-container">
            <label
              htmlFor="movementName"
              className="text-primary-50 font-semibold"
            >
              Description
            </label>
            <InputText
              id="description"
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white-alpha-20 border-none p-3 text-primary-50"
            ></InputText>
          </div>
        </div>
        <div className="dialog-btn-container flex align-items-center gap-2">
          <Button
            label="Cancel"
            onClick={() => setVisible(false)}
            text
            className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"
          ></Button>
          <Button
            label="+ Add"
            onClick={() => {
              handleSubmit();
              setVisible(false);
            }}
            text
            className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"
          ></Button>
        </div>
      </div>
    </Dialog>
  );
}
