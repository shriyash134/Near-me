const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    // Customer who created the task
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Task Details
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    budget: {
      type: Number,
      required: true,
      min: 0,
    },

    // Address
    address: {
      type: String,
      required: true,
      trim: true,
    },

    locality: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    // Map Coordinates
    latitude: {
      type: Number,
      default: null,
    },

    longitude: {
      type: Number,
      default: null,
    },

    // Task Status
    status: {
      type: String,
      enum: [
        "Open",
        "Accepted",
        "Completed",
        "Cancelled",
      ],
      default: "Open",
    },

    // Helper who accepts the task
    acceptedHelper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);