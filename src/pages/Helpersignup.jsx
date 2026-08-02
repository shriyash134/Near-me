import "./HelperSignup.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HelperSignup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    serviceCategory: "",
    locality: "",
    city: "",
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
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/signup`,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: "helper",
          serviceCategories: [formData.serviceCategory],
          locality: formData.locality,
          city: formData.city,
        },
        {
          withCredentials: true,
        }
      );

      alert("Signup Successful");
      console.log(res.data);

      navigate("/helper/dashboard");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Server Error");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1>Earn by Helping</h1>

        <p>Create your helper account and start earning.</p>

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
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
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

          <select
            name="serviceCategory"
            value={formData.serviceCategory}
            onChange={handleChange}
            required
          >
            <option value="">Select Service Category</option>
            <option value="Electrician">Electrician</option>
            <option value="Plumber">Plumber</option>
            <option value="Carpenter">Carpenter</option>
            <option value="Cleaner">Cleaner</option>
            <option value="Tutor">Tutor</option>
            <option value="Delivery">Delivery</option>
            <option value="Pet Care">Pet Care</option>
            <option value="Event Helper">Event Helper</option>
          </select>

          <input
            type="text"
            name="locality"
            placeholder="Locality"
            value={formData.locality}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
          />

          <button type="submit">Create Account</button>
        </form>
      </div>
    </div>
  );
}