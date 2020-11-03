import React, { useEffect, useState } from "react";
import "./css/App.css";
import Chat from "./Chat";
import Sidebar from "./Sidebar";
import axios from "./axios";
import openSocket from "socket.io-client";

const socket = openSocket(
  process.env.REACT_APP_SOCKET_ENDPOINT || "http://localhost:5000"
);

const App = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.connect();
    axios.get("/api/v1/messages/sync").then((response) => {
      console.log(response.data);
      setMessages(response.data);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.connect();

    socket.on("new-message", function (newMessage) {
      setMessages([...messages, newMessage]);
    });

    return () => {
      socket.disconnect();
    };
  }, [messages]);

  // console.log(messages);

  return (
    <div className="app">
      <div className="app__body">
        <Sidebar />
        <Chat messages={messages} />
      </div>
    </div>
  );
};

export default App;
