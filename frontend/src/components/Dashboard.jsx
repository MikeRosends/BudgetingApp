import "../index.css";
import Sidebar from "./Sidebar";
import { useState } from "react";

import { Link } from "react-router-dom";
import MyPopup from "./MyPopup";
import PromptPopup from "./PromptPopup";
import { MainContainer } from "./MainContainer";

export default function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <MainContainer />
    </div>
  );
}