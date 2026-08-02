const { Server } = require("socket.io");
const Message = require("./models/message");

let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: [
        "http://localhost:5173",
        process.env.CLIENT_URL,
      ],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ User Connected:", socket.id);

    // Join task room
    socket.on("joinRoom", (taskId) => {
      socket.join(taskId);
      console.log(`${socket.id} joined room ${taskId}`);
    });

    // Send Message
    socket.on("sendMessage", async (data) => {
      try {
        console.log("Received:", data);

        const message = await Message.create({
          taskId: data.taskId,
          sender: data.sender,
          text: data.text,
        });

        const populatedMessage = await Message.findById(message._id)
          .populate("sender", "name email");

        // Broadcast populated message
        io.to(data.taskId).emit("receiveMessage", populatedMessage);

        console.log("Saved & Broadcasted");
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ User Disconnected:", socket.id);
    });
  });
};

const getIO = () => io;

module.exports = {
  initSocket,
  getIO,
};