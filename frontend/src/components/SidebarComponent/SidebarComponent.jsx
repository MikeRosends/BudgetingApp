import React from "react";
import { Link } from "react-router-dom";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import "./SidebarComponent.css";

export default function SidebarComponent() {
  const [visible, setVisible] = React.useState(false);

  return (
    <div>
      <Button
        icon="pi pi-bars"
        onClick={() => setVisible(true)}
        className="p-button-text"
      />
      <Sidebar visible={visible} onHide={() => setVisible(false)}>
        <h3>Menu</h3>
        <ul className="sidebar-menu">
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/accounts">Accounts</Link>
          </li>
          <li>
            <Link to="/movements">Movements</Link>
          </li>
          <li>
            <Link to="/balance_progression">Balance Progression</Link>
          </li>
          <li>
            <Link to="/starting_amount">Starting Amount</Link> {/* New Link */}
          </li>
        </ul>
      </Sidebar>
    </div>
  );
}
