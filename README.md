# Real-time Chat Application

This is a real-time chat application built with Next.js, Express, Socket.io, and Redis.

## Technologies Used

- **Next.js**: For building the user interface
- **Express**: For handling the server-side logic
- **Socket.io**: For real-time WebSocket communication
- **Redis**: For message queuing and reliable communication

## Installation

### Prerequisites

Make sure you have the following installed on your machine:

- Node.js
- npm (or yarn)
- Redis

### Redis Installation

Follow the instructions on the [Redis website](https://redis.io/download) to install Redis on your machine.

### Setting Up the Project

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/realtime-chat.git
    cd realtime-chat
    ```

2. Install dependencies for both the server and the client:

    ```bash
    # For the server
    cd ./server
    npm install

    # For the client
    cd ./client
    npm install
    ```

## Usage

1. Start Redis server:

    ```bash
    redis-server
    ```

2. Start the server:

    ```bash
    cd ./server
    npm run dev
    ```

3. Start the client:

    ```bash
    cd ./client
    npm run dev
    ```

4. Open your browser and navigate to `http://localhost:3000` to use the chat application.
