import React, { useState } from "react";
import Popup from "reactjs-popup";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";

const PromptPopup = () => {
  const [name, setName] = useState("");
  const [value, setValue] = useState();
  const [selectedMovementtype, setSelectedMovementtype] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const movementType = [
    { name: "Deposit", code: "dp" },
    { name: "Expense", code: "exp" },
    { name: "Transfer", code: "trans" },
  ];

  const accounts = [
    { name: "Cartão Refeição", code: "ref" },
    { name: "À ordem", code: "ord" },
    { name: "Conta popança", code: "cp" },
  ];

  return (
    <Popup
      trigger={
        <button className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
          Enter New Movement
        </button>
      }
      position="right center"
    >
      <div className="bg-gray-200">
        <label htmlFor="Your Movement:">Your Movement:</label>
        <Dropdown
          value={selectedMovementtype}
          onChange={(e) => setSelectedMovementtype(e.value)}
          options={movementType}
          optionLabel="name"
          placeholder="Select a movement type"
          className="w-full md:w-14rem"
          checkmark={true}
          highlightOnSelect={false}
        />
        <label htmlFor="Description">Description:</label>
        <InputText value={name}
          placeholder="Movement name..." onChange={(e) => setName(e.target.value)} />
        <InputNumber
          variant="outlined"
          placeholder="00.00 €"
          value={value}
          onValueChange={(e) => setValue(e.value)}
          mode="decimal"
          minFractionDigits={2}
        />
        <Dropdown
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.value)}
          options={accounts}
          optionLabel="name"
          placeholder="Select an account"
          className="w-full md:w-14rem"
          checkmark={true}
          highlightOnSelect={false}
        />
      </div>
    </Popup>
  );
};

export default PromptPopup;
