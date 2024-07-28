const amqp = require("amqplib");

const RABBITMQ_URL = "amqp://localhost";
const QUEUE_NAME = "chat_messages";

let channel;

const connectRabbitMQ = async (io) => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    consumeMessages(io);
  } catch (error) {
    console.error("Failed to connect to RabbitMQ", error);
    process.exit(1);
  }
};

const sendMessageToQueue = async (message) => {
  if (!channel) {
    throw new Error("RabbitMQ channel is not initialized");
  }
  if (!message) {
    throw new Error("Message is undefined or null");
  }

  try {
    const sent = channel.sendToQueue(
      QUEUE_NAME,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );
    if (sent) {
      console.log("Message sent to queue:", message);
    } else {
      console.error("Failed to send message to queue");
    }
  } catch (error) {
    console.error("Error sending message to queue", error);
    throw error;
  }
};

const consumeMessages = (io) => {
  if (!channel) {
    throw new Error("RabbitMQ channel is not initialized");
  }

  channel.consume(
    QUEUE_NAME,
    (msg) => {
      if (msg !== null) {
        try {
          const message = JSON.parse(msg.content.toString());
          io.emit("receive_message", message);
          channel.ack(msg);
        } catch (error) {
          console.error("Failed to parse message:", error);
          channel.ack(msg);
        }
      }
    },
    { noAck: false }
  );
};

module.exports = {
  connectRabbitMQ,
  sendMessageToQueue,
};
