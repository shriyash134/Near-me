const mongoose = require("mongoose");
const passportLocalMongoose =
  require("passport-local-mongoose").default;



const userSchema = new mongoose.Schema(
  {
    // =========================
    // Basic Information
    // =========================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    

    role: {
      type: String,
      enum: ["customer", "helper"],
      required: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    // =========================
    // Address
    // =========================

    locality: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    pincode: {
      type: String,
      trim: true,
    },

    // Location (Future Map Feature)
    location: {
      latitude: {
        type: Number,
      },

      longitude: {
        type: Number,
      },
    },

    // =========================
    // Helper Information
    // =========================

    serviceCategories: [
      {
        type: String,
        trim: true,
        index: true,
      },
    ],

    experience: {
      type: Number,
      default: 0,
      min: 0,
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    hourlyRate: {
      type: Number,
      default: 0,
      min: 0,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    availability: {
      type: String,
      enum: [
        "Morning",
        "Afternoon",
        "Evening",
        "Night",
        "Anytime",
      ],
      default: "Anytime",
    },

    status: {
      type: String,
      enum: ["Available", "Busy", "Offline"],
      default: "Available",
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    completedTasks: {
      type: Number,
      default: 0,
      min: 0,
    },

    // =========================
    // Verification
    // =========================

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
});

module.exports = mongoose.model("User", userSchema);