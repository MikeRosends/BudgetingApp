import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import "./login.css";

const Login = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    user_email: "",
    user_password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      axios
        .post(`${apiUrl}/v1/login`, formData)
        .then((res) => {
          localStorage.setItem("token", res.data.token);
          navigate("/dashboard");
        })
        .catch((err) => {
          setMessage(err.response?.data?.message || "Login failed");
        });
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/register"); // Navigate to /register page
  };

  return (
    <div className="login">
      <h2>Welcome</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="user_email"
          placeholder="Username"
          value={formData.user_email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="user_password"
          placeholder="Password"
          value={formData.user_password}
          onChange={handleChange}
          required
        />
        <Button type="submit" label="Login" severity="success" raised />
      </form>
      {message && <p>{message}</p>}

      {/* Register button */}
      <Button
        type="button"
        onClick={handleRegisterRedirect}
        label="Register"
        severity="info"
        outlined
      />
    </div>
  );
};

export default Login;
