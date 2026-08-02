import "./TaskCard.css";
import { useNavigate } from "react-router-dom";

export default function TaskCard({ task }) {
  const navigate = useNavigate();
  console.log(task);
  return (
    <div className="task-card">
      <h2>{task.title}</h2>

      <p>{task.description}</p>

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
      <button
  className="view-btn"
  onClick={() => navigate(`/customer/task/${task._id}`)}
>
  View
</button>
{task.acceptedHelper && (
  <div className="helper-info">
    <h4>✅ Accepted By</h4>

    <p>
      <strong>Name:</strong> {task.acceptedHelper.name}
    </p>

    <p>
      <strong>Email:</strong> {task.acceptedHelper.email}
    </p>

    <p>
      <strong>Rating:</strong> ⭐ {task.acceptedHelper.averageRating}
    </p>
  </div>
)}
    </div>
    
  );
}