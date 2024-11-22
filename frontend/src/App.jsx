import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import Accounts from "./components/Accounts";
import Movements from "./components/Movements";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/movements" element={<Movements />} />
        
      </Routes>
    </Router>
  );
}

export default App;
