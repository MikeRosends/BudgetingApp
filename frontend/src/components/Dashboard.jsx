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

{/* <div className="frame">
  <div className="m-20">
    <Link to="/movements">
      <button class="custom-btn btn-4 text-nowrap px-10">
        <span className="px-10">Check Movements</span>
      </button>
    </Link>

    <button class="custom-btn btn-13">Add Other movement</button>
  </div>
</div>;
 */}