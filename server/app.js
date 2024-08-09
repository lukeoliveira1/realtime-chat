const express = require("express");
const http = require("http");
const socket = require("socket.io");
const cors = require("cors");
const chatSocket = require("./sockets/chatSocket");
const errorHandler = require("./middlewares/errorHandler");

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

app.use(errorHandler);

const users = {};
const rooms = {};

io.on("connection", (socket) => {
  chatSocket(io, socket, users, rooms);
});

module.exports = {
  app,
  server,
  io,
};
