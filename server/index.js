const express = require("express");
const http = require("http");
const socket = require("socket.io");
const cors = require("cors");

const { connectRabbitMQ, sendMessageToQueue } = require("./rabbitmq");

const app = express();
const server = http.createServer(app);
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  })
);

const SERVER_HOST = "localhost";
const SERVER_PORT = 3001;

// listening to front-end events (socket.io)
io.on("connection", (socket) => {
  console.log("Usuário conectado!", socket.id);

  socket.on("disconnect", (reason) => {
    console.log("Usuário desconectado!", socket.id);
  });

  socket.on("set_username", (username) => {
    socket.data.username = username;
  });

  socket.on("message", async (message) => {
    const messageToSend = {
      id: Date.now(),
      text: message.text,
      authorId: socket.id,
      author: socket.data.username || "Unknown",
    };

    try {
      await sendMessageToQueue(messageToSend);
    } catch (error) {
      console.error("Failed to send message to RabbitMQ", error);
    }
  });
});

server.listen(SERVER_PORT, SERVER_HOST, () =>
  console.log(`Server running at http://${SERVER_HOST}:${SERVER_PORT}`)
);

connectRabbitMQ(io);
