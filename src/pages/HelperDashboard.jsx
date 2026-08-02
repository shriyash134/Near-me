import { useEffect, useState } from "react";
import axios from "axios";
import HelperTaskCard from "../components/HelperTaskcard";
import "./HelperDashboard.css";
import socket from "../socket";

export default function HelperDashboard() {
  const [openTasks, setOpenTasks] = useState([]);
  const [acceptedTasks, setAcceptedTasks] = useState([]);

  const [helperLocation, setHelperLocation] = useState({
    latitude: null,
    longitude: null,
  });

  // ===========================
  // Get Helper Current Location
  // ===========================
  const getHelperLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setHelperLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.log(error);
        alert("Unable to get location");
      }
    );
  };

  // ===========================
  // Fetch Tasks
  // ===========================
  const fetchTasks = async () => {
    try {
      const openRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tasks/open`,
        {
          params: {
            latitude: helperLocation.latitude,
            longitude: helperLocation.longitude,
          },
          withCredentials: true,
        }
      );

      setOpenTasks(openRes.data);

      const acceptedRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tasks/helper`,
        {
          withCredentials: true,
        }
      );

      setAcceptedTasks(acceptedRes.data);
    } catch (err) {
      console.log(err);
      setOpenTasks([]);
      setAcceptedTasks([]);
    }
  };

  // ===========================
  // Get Location Once
  // ===========================
  useEffect(() => {
    getHelperLocation();
  }, []);

  // ===========================
  // Fetch Tasks After Location
  // ===========================
  useEffect(() => {
    if (!helperLocation.latitude || !helperLocation.longitude) return;

    fetchTasks();
  }, [helperLocation]);

  // ===========================
  // Socket Events
  // ===========================
  useEffect(() => {
    const handleNewTask = () => fetchTasks();
    const handleTaskAccepted = () => fetchTasks();
    const handleTaskCompleted = () => fetchTasks();

    socket.on("newTask", handleNewTask);
    socket.on("taskAccepted", handleTaskAccepted);
    socket.on("taskCompleted", handleTaskCompleted);

    return () => {
      socket.off("newTask", handleNewTask);
      socket.off("taskAccepted", handleTaskAccepted);
      socket.off("taskCompleted", handleTaskCompleted);
    };
  }, [helperLocation]);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Near Me</h1>

        <div>
          <h2>Hello, Helper 👋</h2>
          <p>Welcome Back</p>
        </div>
      </header>

      {/* Available Tasks */}
      <section className="task-section">
        <h2>Available Tasks</h2>

        <div className="task-list">
          {openTasks.length === 0 ? (
            <h3>No Open Tasks</h3>
          ) : (
            openTasks.map((task) => (
              <HelperTaskCard key={task._id} task={task} />
            ))
          )}
        </div>
      </section>

      {/* Accepted Tasks */}
      <section className="task-section">
        <h2>My Accepted Tasks</h2>

        <div className="task-list">
          {acceptedTasks.length === 0 ? (
            <h3>No Accepted Tasks</h3>
          ) : (
            acceptedTasks.map((task) => (
              <HelperTaskCard key={task._id} task={task} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}