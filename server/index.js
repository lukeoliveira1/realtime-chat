const { app, server, io } = require("./app");
const { consumeMessages } = require("./services/redisService");

const SERVER_HOST = "localhost";
const SERVER_PORT = 3001;

server.listen(SERVER_PORT, SERVER_HOST, () => {
  console.log(`Server running at http://${SERVER_HOST}:${SERVER_PORT}`);
  consumeMessages(io);
});
