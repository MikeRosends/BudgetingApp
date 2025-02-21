import "../../index.css";
import { useState } from "react";
import "./Dashboard.css";
import { Link } from "react-router-dom";
import MyPopup from "../MyPopup";
import PromptPopup from "../PromptPopup";
import MainContainer from "../MainContainer/MainContainer";
import SidebarComponent from "../SidebarComponent/SidebarComponent";

export default function Dashboard() {
  return (
    <div className="maincontainer">
      <SidebarComponent />
      <MainContainer />
    </div>
  );
}
