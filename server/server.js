require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("./config/passport");
require("./config/db");

const http = require("http");

const { initSocket } = require("./socket");

const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/tastRoute");
const messageRoute = require("./routes/messageRoute");

const app = express();
const server = http.createServer(app);

// ===============================
// Trust Proxy (Required for Render)
// ===============================
app.set("trust proxy", 1);

// ===============================
// Socket.IO
// ===============================
initSocket(server);

// ===============================
// CORS
// ===============================
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
];

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without an origin (Postman, mobile apps, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// ===============================
// Middleware
// ===============================
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,      // Render (HTTPS)
      sameSite: "none",  // Vercel ↔ Render
      httpOnly: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ===============================
// Routes
// ===============================
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/messages", messageRoute);

// ===============================
// Home Route
// ===============================
app.get("/", (req, res) => {
  res.send("Near Me API is Running 🚀");
});

// ===============================
// Start Server
// ===============================
const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`🚀 Server Running on Port ${PORT}`);
});