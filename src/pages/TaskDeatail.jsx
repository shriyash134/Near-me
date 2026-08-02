import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./TaskDetail.css";
import socket from "../socket";
import Chat from "../components/Chat";

export default function TaskDetail() {
  const [task, setTask] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  const fetchTask = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tasks/${id}`,
        {
          withCredentials: true,
        }
      );

      setTask(res.data.task);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTask();

    socket.emit("joinRoom", id);

    return () => {
      socket.off("joinRoom");
    };
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/tasks/${id}`,
        {
          withCredentials: true,
        }
      );

      alert("Task deleted successfully");
      navigate("/customer/dashboard");
    } catch (err) {
      console.log(err);
      alert("Failed to delete task");
    }
  };

  if (!task) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="task-detail-container">
      <div className="task-detail-header">
        <h1>{task.title}</h1>

        <span className={`status ${task.status.toLowerCase()}`}>
          {task.status}
        </span>
      </div>

      <div className="task-description">
        <h2>Description</h2>
        <p>{task.description}</p>
      </div>

      <div className="task-info">
        <div className="info-card">
          <h3>Category</h3>
          <p>{task.category}</p>
        </div>

        <div className="info-card">
          <h3>Budget</h3>
          <p>₹{task.budget}</p>
        </div>

        <div className="info-card">
          <h3>Locality</h3>
          <p>{task.locality}</p>
        </div>

        <div className="info-card">
          <h3>City</h3>
          <p>{task.city}</p>
        </div>
      </div>

      <div className="action-buttons">
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          Back
        </button>

        <button
          className="edit-btn"
          onClick={() => navigate(`/customer/edit-task/${task._id}`)}
        >
          Edit
        </button>

        <button
          className="delete-btn"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>

      <Chat taskId={task._id} />
    </div>
  );
}