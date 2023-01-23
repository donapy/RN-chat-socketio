import "./App.css";
import io from "socket.io-client";
import React, { useState, useEffect } from "react";
const socket = io.connect("http://localhost:3001");

function App() {
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message);
    });
  }, [socket]);

  const sendMessage = () => {
    if (room !== "") {
      socket.emit("send_message", { message, room });
      setMessage("");
    } else {
      alert(`Need id of the room to send message`);
    }
  };

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
      alert(`Joined room ${room}`);
    } else {
      alert(`Need id of the room`);
    }
  };

  return (
    <div className="App">
      <input
        type="number"
        placeholder="Room..."
        onChange={(e) => setRoom(e.target.value)}
      />
      <button onClick={joinRoom}>Join Room</button>
      <br />
      <input
        type="text"
        placeholder="Message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send Message</button>
      <hr />
      <h1>Messages</h1>
      {messageReceived}
    </div>
  );
}

export default App;
