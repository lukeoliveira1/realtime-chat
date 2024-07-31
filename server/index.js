const express = require("express");
const http = require("http");
const socket = require("socket.io");
const cors = require("cors");
const { connectRabbitMQ, sendMessageToQueue } = require("./rabbitmq");

const users = {};

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

  socket.on("set_username", (username) => {
    users[socket.id] = username;
    io.emit(
      "user_list",
      Object.keys(users).map((id) => ({ id, username: users[id] }))
    );
    socket.broadcast.emit("user_connected", { id: socket.id, username });
    console.log(`Nome de usuário definido: ${username}`);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("user_disconnected", socket.id);
    delete users[socket.id]; // Remove o usuário do registro
    io.emit(
      "user_list",
      Object.keys(users).map((id) => ({ id, username: users[id] }))
    );
    console.log("Usuário desconectado!", socket.id);
  });

  socket.on("message", async (message) => {
    const messageToSend = {
      id: Date.now(),
      text: message.text,
      authorId: socket.id,
      author: users[socket.id] || "Unknown",
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
