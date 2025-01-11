import "../../index.css";
import Sidebar from "../Sidebar";
import { useState } from "react";
import "./Dashboard.css"
import { Link } from "react-router-dom";
import MyPopup from "../MyPopup";
import PromptPopup from "../PromptPopup";
import MainContainer from "../MainContainer/MainContainer";
import NavbarComponent from "../NavbarComponent/NavbarComponent";

export default function Dashboard() {
  return (
    <div className="maincontainer">
      <NavbarComponent />
      <MainContainer />
    </div>
  );
}
