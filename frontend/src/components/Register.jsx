import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

const Register = () => {
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
        .post("http://localhost:8181/v1/register", formData)
        .then(() => {
          setMessage("Registration successful! You can now log in.");
          navigate("/login");
        })
        .catch((err) => {
          setMessage(err.response?.data?.message || "Login failed");
        });
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login"); // Navigate to /register page
  };

  return (
    <div className="register">
      <h2>Create a new account</h2>
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
          type="user_password"
          name="user_password"
          placeholder="Password"
          value={formData.user_password}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}

      {/* Register button */}
      <button type="button" onClick={handleLoginRedirect}>
        Login
      </button>
    </div>
  );
};

export default Register;
