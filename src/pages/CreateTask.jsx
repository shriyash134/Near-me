import "./CreateTask.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateTask() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    address: "",
    locality: "",
    city: "",
    latitude: "",
    longitude: "",
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
        `${import.meta.env.VITE_API_URL}/api/tasks`,
        formData,
        {
          withCredentials: true,
        }
      );

      alert("Task Created Successfully!");

      console.log(res.data);

      navigate("/customer/dashboard");
    } catch (err) {
      console.log(err);

      if (err.response) {
        alert(err.response.data.message);
      } else {
        alert("Server Error");
      }
    }
  };

  const getCurrentLocation = () => {
    const token = import.meta.env.VITE_MAPBOX_TOKEN;

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          const res = await axios.get(
            `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${longitude}&latitude=${latitude}&access_token=${token}`
          );

          console.log(res.data.features);

          const features = res.data.features;

          const address =
            features[0]?.properties?.full_address || "";

          let locality = "";
          let city = "";

          features.forEach((feature) => {
            if (feature.properties?.feature_type === "locality") {
              locality = feature.properties.name;
            }

            if (feature.properties?.feature_type === "place") {
              city = feature.properties.name;
            }
          });

          setFormData((prev) => ({
            ...prev,
            address,
            locality,
            city,
            latitude,
            longitude,
          }));
        } catch (err) {
          console.log(err);
          alert("Unable to fetch address.");
        }
      },
      (error) => {
        console.log(error);
        alert("Unable to get current location.");
      }
    );
  };

  return (
    <div className="create-task-page">
      <div className="create-task-card">
        <h1>Post a New Task</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Task Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Task Description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Electrician">Electrician</option>
            <option value="Plumber">Plumber</option>
            <option value="Carpenter">Carpenter</option>
            <option value="Cleaner">Cleaner</option>
            <option value="Tutor">Tutor</option>
            <option value="Delivery">Delivery</option>
            <option value="Pet Care">Pet Care</option>
            <option value="Event Helper">Event Helper</option>
          </select>

          <input
            type="number"
            name="budget"
            placeholder="Budget (₹)"
            value={formData.budget}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="address"
            placeholder="Full Address"
            value={formData.address}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="locality"
            placeholder="Locality"
            value={formData.locality}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            step="any"
            name="latitude"
            placeholder="Latitude"
            value={formData.latitude}
            onChange={handleChange}
          />

          <input
            type="number"
            step="any"
            name="longitude"
            placeholder="Longitude"
            value={formData.longitude}
            onChange={handleChange}
          />

          <button type="button" onClick={getCurrentLocation}>
            📍 Use Current Location
          </button>

          <button type="submit">
            Create Task
          </button>
        </form>
      </div>
    </div>
  );
}