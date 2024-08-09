const { sendMessageToStream } = require("../services/redisService");

let notificationId = 0;

function generateUniqueId() {
  return ++notificationId;
}

const setUsername = (io, socket, users) => (username) => {
  users[socket.id] = username; // Armazena o nome de usuário com o ID do socket

  io.emit(
    "user_list",
    Object.keys(users).map((id) => ({ id, username: users[id] }))
  ); // Atualiza todos os clientes com a lista de usuários

  socket.broadcast.emit("user_connected", { id: socket.id, username }); // Notifica os outros sobre o novo usuário

  console.log(`Username set: ${username}`);
  socket.emit("username_set", username); // Confirma o nome de usuário definido para o usuário atual
};

const joinRoom = (io, socket, users, rooms) => (roomName) => {
  if (!users[socket.id]) {
    socket.emit("error", "Username not set.");
    return;
  }

  if (!rooms[roomName]) {
    rooms[roomName] = { users: [] };
    io.emit("room_list", Object.keys(rooms));
  }

  socket.join(roomName);
  rooms[roomName].users.push(socket.id);
  io.to(roomName).emit(
    "user_list",
    rooms[roomName].users.map((id) => ({ id, username: users[id] }))
  );
  socket.emit("room_joined", roomName, users[socket.id]);

  socket.to(roomName).emit("notification", {
    text: `${users[socket.id]} entrou na sala...`,
    author: "notification",
    roomName: roomName,
  });

  socket.emit("notification", {
    id: generateUniqueId(),
    text: `Você entrou na sala ${roomName}`,
    author: "notification",
    roomName: roomName,
  });
};

const leaveRoom = (io, socket, users, rooms) => (roomName) => {
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

    socket.to(roomName).emit("notification", {
      text: `${users[socket.id]} deixou a sala...`,
      author: "notification",
      roomName: roomName,
    });

    socket.emit("notification", {
      id: generateUniqueId(),
      text: `Você saiu da sala ${roomName}`,
      author: "notification",
      roomName: roomName,
    });

    socket.emit("room_left", roomName);
  }
};

const handleMessage = (io, socket, users) => async (data) => {
  const { roomName, text } = data;
  const messageToSend = {
    id: generateUniqueId(),
    text,
    authorId: socket.id,
    author: users[socket.id] || "Unknown",
    roomName,
  };

  try {
    await sendMessageToStream(messageToSend);
    io.to(roomName).emit("message", messageToSend);
  } catch (error) {
    console.error("Failed to send message to RabbitMQ", error);
  }
};

module.exports = {
  setUsername,
  joinRoom,
  leaveRoom,
  handleMessage,
};
