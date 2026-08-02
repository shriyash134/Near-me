import { useState, useEffect } from "react";
import axios from "axios";
import socket from "../socket";

export default function Chat({ taskId }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  // Load previous messages
  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/messages/${taskId}`,
        {
          withCredentials: true,
        }
      );

      setMessages(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Send message
  const sendMessage = () => {
    if (message.trim() === "") return;

    socket.emit("sendMessage", {
      taskId,
      sender: user.id,
      text: message,
    });

    setMessage("");
  };

  useEffect(() => {
    fetchMessages();

    const handleReceive = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("receiveMessage", handleReceive);

    return () => {
      socket.off("receiveMessage", handleReceive);
    };
  }, [taskId]);

  return (
    <div className="chat-container">
      <h2>Chat</h2>

      <div className="messages">
        {messages.map((msg) => (
          <div key={msg._id} className="message">
            <strong>{msg.sender?.name || "User"}</strong>
            <br />
            {msg.text}
          </div>
        ))}
      </div>

      <input
        type="text"
        placeholder="Type message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={sendMessage}>
        Send
      </button>
    </div>
  );
}