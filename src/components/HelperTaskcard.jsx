import "./HelperTaskCard.css";
import { useNavigate } from "react-router-dom";

export default function HelperTaskCard({ task }) {
  const navigate = useNavigate();

 
  return (
    <div className="helper-task-card">
      <h2>{task.title}</h2>

      <p className="description">
        {task.description.length > 80
          ? task.description.substring(0, 80) + "..."
          : task.description}
      </p>

      <div className="task-info">
        <p>
          <strong>Category:</strong> {task.category}
        </p>

        <p>
          <strong>Budget:</strong> ₹{task.budget}
        </p>

        <p>
          <strong>Status:</strong> {task.status}
        </p>

        <p>
          <strong>Location:</strong> {task.locality}, {task.city}
        </p>
      

        {task.distance !== undefined && (
          <p>
            <strong>Distance:</strong> 📍 {task.distance.toFixed(2)} km away
          </p>
        )}
      </div>

      <button
        className="view-btn"
        onClick={() => navigate(`/helper/task/${task._id}`)}
      >
        View Details
      </button>
      
    </div>
  );
}