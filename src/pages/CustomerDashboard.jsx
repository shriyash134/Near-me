import "./CustomerDashboard.css";
import { useNavigate } from "react-router-dom";
import TaskCard from "../components/TaskCard";
import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket";

export default function CustomerDashboard() {
  const [tasks, setTasks] = useState([]);

  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tasks/my`,
        {
          withCredentials: true,
        }
      );

      setTasks(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();

    const handleTaskAccepted = () => {
      console.log("Customer Dashboard Updated");
      fetchTasks();
    };

    socket.on("taskAccepted", handleTaskAccepted);

    return () => {
      socket.off("taskAccepted", handleTaskAccepted);
    };
  }, []);

  const totalTasks = tasks.length;
  const activeTasks = tasks.filter(
    (task) => task.status === "Open"
  ).length;
  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Near Me</h1>

        <div>
          <h2>Hello, Customer 👋</h2>
          <p>Welcome back</p>
        </div>
      </header>

      <section className="stats">
        <div className="card">
          <h3>Total Tasks</h3>
          <h2>{totalTasks}</h2>
        </div>

        <div className="card">
          <h3>Active</h3>
          <h2>{activeTasks}</h2>
        </div>

        <div className="card">
          <h3>Completed</h3>
          <h2>{completedTasks}</h2>
        </div>
      </section>

      <button
        className="post-btn"
        onClick={() => navigate("/customer/create-task")}
      >
        + Post New Task
      </button>

      <section className="tasks">
        <h2>My Tasks</h2>

        <div className="task-list">
          {tasks.length === 0 ? (
            <p>No tasks posted yet.</p>
          ) : (
            tasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}