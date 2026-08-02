import { Link } from "react-router-dom";
import "./SelectRole.css";

export default function SelectRole() {
  return (
    <div className="role-page">
      <div className="role-container">
        <h1>Choose Your Role</h1>

        <p>How would you like to use Near Me?</p>

        <div className="role-cards">
          <Link to="/signup/customer" className="role-card">
            <div className="role-icon">🏠</div>

            <h2>Hire Help</h2>

            <p>
              Post tasks and hire trusted helpers near you.
            </p>
          </Link>

          <Link to="/signup/helper" className="role-card">
            <div className="role-icon">💼</div>

            <h2>Earn by Helping</h2>

            <p>
              Complete local tasks and earn money.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}