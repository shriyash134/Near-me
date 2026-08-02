const express = require("express");
const router = express.Router();

const isLoggedIn = require("../middleware/isLoggedin");

const {
  createTask,
  getMyTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getOpenTasks,
  acceptTask,
  getAcceptedTasks,
  completeTask,
} = require("../controllers/taskController");

// Create Task
router.post("/", isLoggedIn, createTask);

// Customer's tasks
router.get("/my", isLoggedIn, getMyTasks);

// Open tasks for helpers
router.get("/open", isLoggedIn, getOpenTasks);

router.get("/helper", isLoggedIn, getAcceptedTasks);

// Single task
router.get("/:id", isLoggedIn, getTaskById);

// Update
router.put("/:id", isLoggedIn, updateTask);

// Delete
router.delete("/:id", isLoggedIn, deleteTask);

router.put("/:id/accept", isLoggedIn, acceptTask);

router.put("/:id/complete", isLoggedIn, completeTask);

module.exports = router;