import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Welcome() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="welcome-container">
      <div className="overlay">
        <h1>Near Me</h1>

        <h2>Find Trusted Help Around You</h2>

        <p>
          Connect with nearby helpers or earn money by helping people in your
          area.
        </p>

        <div className="buttons">
          <button onClick={() => navigate("/login")}>
            Login
          </button>

        <button onClick={() => navigate("/select-role")}>
    Create Account
</button>
        </div>
      </div>
    </div>
  );
}