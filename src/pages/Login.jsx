import "./Login.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      );

      alert("Login Successfully!");

      const user = res.data.user;

      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "customer") {
        navigate("/customer/dashboard");
      } else if (user.role === "helper") {
        navigate("/helper/dashboard");
      }
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
    <div className="login-page">
      <div className="login-card">
        <h1>Welcome Back</h1>

        <p>Login to your Near Me account</p>

        <form onSubmit={handleSubmit}>
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

          <button type="submit">Login</button>
        </form>

        <p className="forgot">Forgot Password?</p>
      </div>
    </div>
  );
}