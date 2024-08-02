const express = require("express");
const http = require("http");
const socket = require("socket.io");
const cors = require("cors");
const { connectRabbitMQ, sendMessageToQueue } = require("./rabbitmq");

const users = {};
const rooms = {};

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

let notificationId = 0;

function generateUniqueId() {
  return ++notificationId;
}

io.on("connection", (socket) => {
  console.log("Usuário conectado!", socket.id);

  socket.on("set_username", (username) => {
    users[socket.id] = username;
    // Emite para todos os sockets conectados a lista atualizada de usuários
    io.emit(
      "user_list",
      Object.keys(users).map((id) => ({ id, username: users[id] }))
    );
    socket.broadcast.emit("user_connected", { id: socket.id, username });
    console.log(`Nome de usuário definido: ${username}`);
    // Emitindo um evento de confirmação
    socket.emit("username_set", username);
  });

  socket.on("join_room", (roomName) => {
    if (!users[socket.id]) {
      socket.emit("error", "Nome de usuário não definido.");
      return;
    }

    if (!rooms[roomName]) {
      rooms[roomName] = { users: [] };
      io.emit("room_list", Object.keys(rooms));
      console.log(`Sala de chat criada: ${roomName}`);
    }

    socket.join(roomName);
    rooms[roomName].users.push(socket.id);
    io.to(roomName).emit(
      "user_list",
      rooms[roomName].users.map((id) => ({ id, username: users[id] }))
    );
    socket.emit("room_joined", roomName, users[socket.id]);

    // Notifique todos os usuários na sala sobre a nova entrada
    socket.to(roomName).emit("notification", {
      text: `${users[socket.id]} entrou na sala...`,
      author: "notification",
      roomName: roomName,
    });

    // Notifique o próprio usuário sobre a entrada
    socket.emit("notification", {
      id: generateUniqueId(),
      text: `Você entrou na sala ${roomName}`,
      author: "notification",
      roomName: roomName,
    });

    console.log(`Entrou na sala de chat: ${roomName}`);
  });

  socket.on("leave_room", (roomName) => {
    if (rooms[roomName]) {
      socket.leave(roomName);
      rooms[roomName].users = rooms[roomName].users.filter(
        (id) => id !== socket.id
      );
      if (rooms[roomName].users.length === 0) {
        delete rooms[roomName];
        io.emit("room_list", Object.keys(rooms));
      } else {
        io.to(roomName).emit(
          "user_list",
          rooms[roomName].users.map((id) => ({ id, username: users[id] }))
        );
      }

      // Notifique todos os usuários na sala sobre a nova entrada
      socket.to(roomName).emit("notification", {
        text: `${users[socket.id]} saiu da sala...`,
        author: "notification",
        roomName: roomName,
      });

      // Notifique o próprio usuário sobre a entrada
      socket.emit("notification", {
        id: generateUniqueId(),
        text: `Você saiu da sala ${roomName}`,
        author: "notification",
        roomName: roomName,
      });

      socket.emit("room_left", roomName, users[socket.id]);
      console.log(`Usuário ${users[socket.id]} saiu da sala ${roomName}`);
    }
  });

  socket.on("disconnect", () => {
    for (const roomName in rooms) {
      rooms[roomName].users = rooms[roomName].users.filter(
        (id) => id !== socket.id
      );
      if (rooms[roomName].users.length === 0) {
        delete rooms[roomName];
        io.emit("room_list", Object.keys(rooms));
      } else {
        io.to(roomName).emit(
          "user_list",
          rooms[roomName].users.map((id) => ({ id, username: users[id] }))
        );
      }
    }
    socket.broadcast.emit("user_disconnected", socket.id);
    delete users[socket.id];
    console.log("Usuário desconectado!", socket.id);
  });

  socket.on("message", async (data) => {
    const { roomName, text } = data;
    const messageToSend = {
      id: Date.now(),
      text,
      authorId: socket.id,
      author: users[socket.id] || "Unknown",
      roomName,
    };

    try {
      await sendMessageToQueue(messageToSend);
      io.to(roomName).emit("message", messageToSend);
    } catch (error) {
      console.error("Failed to send message to RabbitMQ", error);
    }
  });
});

server.listen(SERVER_PORT, SERVER_HOST, () =>
  console.log(`Server running at http://${SERVER_HOST}:${SERVER_PORT}`)
);

connectRabbitMQ(io);
