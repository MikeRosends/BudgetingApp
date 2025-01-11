import React from "react";
import { TabMenu } from "primereact/tabmenu";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./NavbarComponent.css";

export default function NavbarComponent() {
  const navigate = useNavigate();

  const items = [
    {
      label: "Dashboard",
      icon: "pi pi-home",
      command: () => navigate("/dashboard"),
    },
    {
      label: "Movements",
      icon: "pi pi-wallet",
      command: () => navigate("/movements"),
    },
  ];

  const handleLogout = () => {
    // Implement your logout logic here
    console.log("Logging out...");
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="maindiv">
      <div className="tabmenu-container">
        <TabMenu model={items} />
        <Link to="/login">
          <button>
            <i className="pi pi-sign-out" />
          </button>
        </Link>
      </div>
    </div>
  );
}
