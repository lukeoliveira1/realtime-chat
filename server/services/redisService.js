const Redis = require("ioredis");

const REDIS_URL = "redis://localhost:6379";
const STREAM_NAME = "chat_messages";

const redis = new Redis(REDIS_URL);

const sendMessageToStream = async (message) => {
  try {
    console.log("Preparing to send message to Redis stream:", message);
    const result = await redis.xadd(
      STREAM_NAME,
      "*",
      "message",
      JSON.stringify(message)
    );
    console.log("Message sent to Redis stream. Result:", result);
  } catch (error) {
    console.error("Error sending message to Redis stream:", error);
    throw error;
  }
};

const consumeMessages = (io) => {
  (async () => {
    while (true) {
      try {
        // Using a timeout to avoid blocking indefinitely
        const messages = await redis.xread(
          "BLOCK",
          1000,
          "STREAMS",
          STREAM_NAME,
          "0"
        );

        // Check if messages is not null and is an array
        if (Array.isArray(messages)) {
          for (const [stream, entries] of messages) {
            if (Array.isArray(entries)) {
              for (const [id, fields] of entries) {
                const message = JSON.parse(fields[1]);
                console.log("Received message from Redis stream:", message);
                io.emit("receive_message", message);

                // Remove the message from the stream after processing
                await redis.xdel(STREAM_NAME, id);
                console.log("Message deleted from Redis stream:", id);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error consuming messages from Redis stream:", error);
      }
    }
  })();
};

module.exports = {
  sendMessageToStream,
  consumeMessages,
};
