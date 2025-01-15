import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Dashboard from "./components/Dashboard/Dashboard";
import Accounts from "./components/Accounts";
import Movements from "./components/Movements/Movements";
import Login from "./components/Login";
import Register from "./components/Register";
import NewMovementDialog from "./components/DialogBoxes/NewMovementDialog"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/movements" element={<Movements />} />
        <Route path="/dialog" element={<NewMovementDialog />} />
        
      </Routes>
    </Router>
  );
}

export default App;
