import "./EditTask.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    locality: "",
    city: "",
    status: "",
  });

  useEffect(() => {
    fetchTask();
  }, []);

  const fetchTask = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tasks/${id}`,
        {
          withCredentials: true,
        }
      );

      setTask(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setTask({
      ...task,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/tasks/${id}`,
        task,
        {
          withCredentials: true,
        }
      );

      alert("Task Updated Successfully");

      navigate("/customer/dashboard");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="edit-task-container">
      <h1>Edit Task</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={task.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />

        <textarea
          name="description"
          value={task.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />

        <input
          type="text"
          name="category"
          value={task.category}
          onChange={handleChange}
          placeholder="Category"
          required
        />

        <input
          type="number"
          name="budget"
          value={task.budget}
          onChange={handleChange}
          placeholder="Budget"
          required
        />

        <input
          type="text"
          name="locality"
          value={task.locality}
          onChange={handleChange}
          placeholder="Locality"
          required
        />

        <input
          type="text"
          name="city"
          value={task.city}
          onChange={handleChange}
          placeholder="City"
          required
        />

        <select
          name="status"
          value={task.status}
          onChange={handleChange}
        >
          <option value="Open">Open</option>
          <option value="Accepted">Accepted</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <button type="submit">
          Update Task
        </button>
      </form>
    </div>
  );
}