const Task = require("../models/task");
const {getIO} = require("../socket");

const getDistance = require("../utils/distance");

 

// =====================================
// Create Task
// POST /api/tasks
// =====================================

exports.createTask = async (req, res) => {
  try {
    const newTask = await Task.create({
      ...req.body,
      customerId: req.user._id,
    });
     const io = getIO();
     io.emit("newTask",newTask);
    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task: newTask,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =====================================
// Get Logged-in Customer Tasks
// GET /api/tasks/my
// =====================================

exports.getMyTasks = async (req, res) => {
  try {
   

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const tasks = await Task.find({
      customerId: req.user._id,
    }).populate("acceptedHelper", "name email phone averageRating")
    .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =====================================
// Get Single Task
// GET /api/tasks/:id
// =====================================

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// =====================================
// Update Task
// PUT /api/tasks/:id
// =====================================

exports.updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        customerId: req.user._id,
      },
      req.body,
      {
        new: true,
      }
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =====================================
// Delete Task
// DELETE /api/tasks/:id
// =====================================

exports.deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      customerId: req.user._id,
    });

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



exports.getOpenTasks = async (req, res) => {
  try {
    // Helper's current location
    const helperLat = parseFloat(req.query.latitude);
    const helperLng = parseFloat(req.query.longitude);

    // If location is not received
    if (!helperLat || !helperLng) {
      return res.status(400).json({
        message: "Helper location is required",
      });
    }

    // Fetch all open tasks
    const tasks = await Task.find({
      status: "Open",
    });

    // Calculate distance for each task
    const nearbyTasks = tasks
      .map((task) => {
        const distance = getDistance(
          helperLat,
          helperLng,
          task.latitude,
          task.longitude
        );

        return {
          ...task.toObject(),
          distance,
        };
      })

      // Keep only tasks within 10 KM
      .filter((task) => task.distance <= 10)

      // Sort nearest first
      .sort((a, b) => a.distance - b.distance);

    res.status(200).json(nearbyTasks);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// =====================================
// Accept Task
// PUT /api/tasks/:id/accept
// =====================================

exports.acceptTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (task.status !== "Open") {
      return res.status(400).json({
        message: "Task already accepted",
      });
    }

    task.acceptedHelper = req.user._id;
    task.status = "Accepted";

    await task.save();

    // Notify all connected clients
    const io = getIO();
    io.emit("taskAccepted", task);

    res.status(200).json({
      message: "Task accepted successfully",
      task,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// =====================================
// Get Accepted Tasks of Logged-in Helper
// GET /api/tasks/helper
// =====================================

exports.getAcceptedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      acceptedHelper: req.user._id,
    })
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// =====================================
// Complete Task
// PUT /api/tasks/:id/complete
// =====================================

exports.completeTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      acceptedHelper: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    task.status = "Completed";

    await task.save();

    // Notify all connected clients
    const io = getIO();
    io.emit("taskCompleted", task);

    res.status(200).json({
      message: "Task completed successfully",
      task,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};