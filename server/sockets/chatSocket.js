const {
  setUsername,
  joinRoom,
  leaveRoom,
  handleMessage,
} = require("../controllers/chatController");

const chatSocket = (io, socket, users, rooms) => {
  socket.on("set_username", (username) => {
    setUsername(io, socket, users)(username);
  });

  socket.on("join_room", joinRoom(io, socket, users, rooms));
  socket.on("leave_room", leaveRoom(io, socket, users, rooms));
  socket.on("message", handleMessage(io, socket, users));

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
  });
};

module.exports = chatSocket;
