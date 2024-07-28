const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const { connectRabbitMQ, sendMessageToQueue } = require("./rabbitmq");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "http://localhost:5173" },
});

const PORT = 3001;

// listening to front-end events (socket.io)
io.on("connection", (socket) => {
  console.log("Usuário conectado!", socket.id);

  socket.on("disconnect", (reason) => {
    console.log("Usuário desconectado!", socket.id);
  });

  socket.on("set_username", (username) => {
    socket.data.username = username;
  });

  socket.on("message", async (text) => {
    const message = {
      text,
      authorId: socket.id,
      author: socket.data.username,
    };

    try {
      await sendMessageToQueue(message);
    } catch (error) {
      console.error("Failed to send message to RabbitMQ", error);
    }
  });
});

server.listen(PORT, () => console.log("Server running..."));

connectRabbitMQ(io);
