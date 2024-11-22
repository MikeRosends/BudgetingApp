import React from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const MyPopup = ({ trigger }) => (
  <Popup
    trigger={trigger}
    position="right center"
    contentStyle={{
      width: "300px",
      padding: "20px",
      backgroundColor: "#f1f1f1",
      textAlign: "center",
    }}
  >
    <div>
      <h2>Add Movement</h2>
      <p>Custom popup content goes here.</p>
    </div>
  </Popup>
);

export default MyPopup;
