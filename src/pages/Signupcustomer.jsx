import "./Signupcustomer.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CustomerSignup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/signup`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "customer",
        },
        {
          withCredentials: true,
        }
      );

      alert("Account created successfully!");
      console.log(res.data);

      navigate("/customer/dashboard");
    } catch (err) {
      console.error(err);

      if (err.response) {
        alert(err.response.data.message);
      } else {
        alert("Server Error");
      }
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1>Create Customer Account</h1>
        <p>Find trusted helpers near you.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit">Create Account</button>
        </form>
      </div>
    </div>
  );
}