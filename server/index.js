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
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST"],
  })
);

const SERVER_HOST = "localhost";
const SERVER_PORT = 3001;

let notificationId = 0; // Variable to keep track of notification IDs

// Function to generate a unique ID for notifications
function generateUniqueId() {
  return ++notificationId;
}

// Handle new Socket.IO connections
io.on("connection", (socket) => {
  console.log("User connected!", socket.id);

  // Handle setting a username for a new user
  socket.on("set_username", (username) => {
    users[socket.id] = username; // Store username with socket ID
    io.emit(
      "user_list",
      Object.keys(users).map((id) => ({ id, username: users[id] }))
    ); // Update all clients with the user list
    socket.broadcast.emit("user_connected", { id: socket.id, username }); // Notify others about the new user
    console.log(`Username set: ${username}`);
    socket.emit("username_set", username); // Confirm username set for the current user
  });

  // Handle joining a chat room
  socket.on("join_room", (roomName) => {
    if (!users[socket.id]) {
      socket.emit("error", "Username not set.");
      return;
    }

    if (!rooms[roomName]) {
      rooms[roomName] = { users: [] }; // Create new room if it doesn't exist
      io.emit("room_list", Object.keys(rooms)); // Update all clients with the room list
      console.log(`Chat room created: ${roomName}`);
    }

    socket.join(roomName); // Add user to the room
    rooms[roomName].users.push(socket.id); // Add user ID to the room's user list
    io.to(roomName).emit(
      "user_list",
      rooms[roomName].users.map((id) => ({ id, username: users[id] }))
    ); // Update room users list
    socket.emit("room_joined", roomName, users[socket.id]); // Confirm room joined for the current user

    // Notify room about the new user
    socket.to(roomName).emit("notification", {
      text: `${users[socket.id]} entrou na sala...`,
      author: "notification",
      roomName: roomName,
    });

    // Notify the current user about their room entry
    socket.emit("notification", {
      id: generateUniqueId(),
      text: `Você entrou na sala ${roomName}`,
      author: "notification",
      roomName: roomName,
    });

    console.log(`Entrou na sala: ${roomName}`);
  });

  // Handle leaving a chat room
  socket.on("leave_room", (roomName) => {
    if (rooms[roomName]) {
      socket.leave(roomName); // Remove user from the room
      rooms[roomName].users = rooms[roomName].users.filter(
        (id) => id !== socket.id
      ); // Remove user ID from the room's user list
      if (rooms[roomName].users.length === 0) {
        delete rooms[roomName]; // Delete room if no users are left
        io.emit("room_list", Object.keys(rooms)); // Update all clients with the room list
      } else {
        io.to(roomName).emit(
          "user_list",
          rooms[roomName].users.map((id) => ({ id, username: users[id] }))
        ); // Update room users list
      }

      // Notify room about the user leaving
      socket.to(roomName).emit("notification", {
        text: `${users[socket.id]} deixou a sala..`,
        author: "notification",
        roomName: roomName,
      });

      // Notify the current user about their room exit
      socket.emit("notification", {
        id: generateUniqueId(),
        text: `Você saiu da sala ${roomName}`,
        author: "notification",
        roomName: roomName,
      });

      socket.emit("room_left", roomName);
      console.log(`Usuário ${users[socket.id]} saiu da sala ${roomName}`);
    }
  });

  // Handle user
  socket.on("disconnect", () => {
    for (const roomName in rooms) {
      rooms[roomName].users = rooms[roomName].users.filter(
        (id) => id !== socket.id
      ); // Remove user ID from each room's user list
      if (rooms[roomName].users.length === 0) {
        delete rooms[roomName]; // Delete room if no users are left
        io.emit("room_list", Object.keys(rooms)); // Update all clients with the room list
      } else {
        io.to(roomName).emit(
          "user_list",
          rooms[roomName].users.map((id) => ({ id, username: users[id] }))
        ); // Update room users list
      }
    }
    socket.broadcast.emit("user_disconnected", socket.id); // Notify others about the user disconnection
    delete users[socket.id];
    console.log("User disconnected!", socket.id);
  });

  // Handle receiving and broadcasting messages
  socket.on("message", async (data) => {
    const { roomName, text } = data;
    const messageToSend = {
      id: generateUniqueId(),
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
