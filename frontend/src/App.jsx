import "./App.css";
import io from "socket.io-client";
import React, { useState, useEffect } from "react";
const socket = io.connect("http://localhost:3001");

function App() {
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    socket.on("receive_message", (data) => {
      if (data.message) {
        let newMessage = {
          sender: data.nickname,
          message: data.message,
        };
        setAllMessages([...allMessages, newMessage]);
      }
    });
  }, [socket, allMessages]);

  const sendMessage = () => {
    if (room !== "") {
      socket.emit("send_message", { message, room, nickname });
      let newMessage = {
        sender: nickname,
        message: message,
      };
      setAllMessages([...allMessages, newMessage]);
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
        type="text"
        placeholder="Nickname..."
        onChange={(e) => setNickname(e.target.value)}
      />
      <button onClick={() => alert(`Nickname setted to ${nickname}`)}>
        Set Nickname
      </button>
      <br />
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
      <div>
        {allMessages &&
          allMessages.map((msgs, key) => {
            return (
              <div
                key={key}
                style={{
                  backgroundColor:
                    nickname === msgs.sender ? "lightblue" : "lightgreen",
                }}
              >
                <h4>{msgs.sender} says:</h4>
                <p> {msgs.message}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default App;
