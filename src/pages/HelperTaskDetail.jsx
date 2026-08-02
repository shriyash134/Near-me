import "./HelperTaskDetail.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Chat from "../components/Chat";
import socket from "../socket";
import TaskMap from "../components/TaskMap";

export default function HelperTaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);

  // ===========================
  // Fetch Task
  // ===========================
  const fetchTask = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tasks/${id}`,
        {
          withCredentials: true,
        }
      );

      setTask(res.data.task || res.data);
    } catch (err) {
      console.log(err);
      alert("Unable to load task");
    }
  };

  useEffect(() => {
    fetchTask();

    socket.emit("joinRoom", id);

    return () => {
      socket.off("taskAccepted");
      socket.off("taskCompleted");
    };
  }, [id]);

  // ===========================
  // Accept Task
  // ===========================
  const handleAccept = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/tasks/${id}/accept`,
        {},
        {
          withCredentials: true,
        }
      );

      alert("Task Accepted Successfully");

      fetchTask();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Unable to accept task");
    }
  };

  // ===========================
  // Complete Task
  // ===========================
  const handleComplete = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/tasks/${id}/complete`,
        {},
        {
          withCredentials: true,
        }
      );

      alert("Task Completed Successfully");

      fetchTask();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Unable to complete task");
    }
  };

  if (!task) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="helper-task-detail">
      <div className="detail-header">
        <h1>{task.title}</h1>

        <span className={`status ${task.status.toLowerCase()}`}>
          {task.status}
        </span>
      </div>

      <div className="detail-card">
        <h2>Description</h2>
        <p>{task.description}</p>
      </div>

      <div className="detail-grid">
        <div className="info-box">
          <h3>Category</h3>
          <p>{task.category}</p>
        </div>

        <div className="info-box">
          <h3>Budget</h3>
          <p>₹{task.budget}</p>
        </div>

        <div className="info-box">
          <h3>Locality</h3>
          <p>{task.locality}</p>
        </div>

        <div className="info-box">
          <h3>City</h3>
          <p>{task.city}</p>

          {task.distance !== undefined && (
            <p>
              <strong>Distance:</strong> 📍 {task.distance.toFixed(2)} km away
            </p>
          )}
        </div>
      </div>

      <div className="button-group">
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          Back
        </button>

        {task.status === "Open" && (
          <button
            className="accept-btn"
            onClick={handleAccept}
          >
            Accept Task
          </button>
        )}

        {task.status === "Accepted" && (
          <button
            className="complete-btn"
            onClick={handleComplete}
          >
            Mark as Completed
          </button>
        )}

        {task.status === "Completed" && (
          <button
            className="completed-btn"
            disabled
          >
            ✅ Task Completed
          </button>
        )}
      </div>

      <TaskMap
        latitude={task.latitude}
        longitude={task.longitude}
      />

      <Chat taskId={task._id} />
    </div>
  );
}