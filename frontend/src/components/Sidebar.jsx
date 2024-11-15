import { useState } from "react";
import "../index.css";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";

export default function SidebarComponent() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`h-screen ${collapsed ? "w-20" : "w-64"}`}>
      <Sidebar className="h-full" collapsed={collapsed}>
        <Button
          label={collapsed ? "Expand" : "Collapse"}
          onClick={toggleSidebar}
          className="my-2 w-full"
        />
        <Menu
          menuItemStyles={{
            button: {
              // the active class will be added automatically by react router
              // so we can use it to style the active menu item
              [`&.active`]: {
                backgroundColor: "#13395e",
                color: "#b6c8d9",
              },
            },
          }}
        >
          <MenuItem component={<Link to="/dashboard" />}>Dashboard</MenuItem>
          <SubMenu defaultOpen label="Mapas">
            <MenuItem component={<Link to="/accounts" />}>Accounts</MenuItem>
          </SubMenu>
        </Menu>
      </Sidebar>
    </div>
  );
}
