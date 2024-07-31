# Real-time Chat Application

This is a real-time chat application built with Next.js, Express, Socket.io, and RabbitMQ.

## Technologies Used

- **Next.js**: For building the user interface
- **Express**: For handling the server-side logic
- **Socket.io**: For real-time WebSocket communication
- **RabbitMQ**: For message queuing and reliable communication

## Installation

### Prerequisites

Make sure you have the following installed on your machine:

- Node.js
- npm (or yarn)
- RabbitMQ

### RabbitMQ Installation

Follow the instructions on the [RabbitMQ website](https://www.rabbitmq.com/download.html) to install RabbitMQ on your machine.

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

1. Start RabbitMQ server

2. Start the server:

    ```bash
    npm run dev
    ```

3. Start the client:

    ```bash
    npm run dev
    ```

4. Open your browser and navigate to `http://localhost:3000` to use the chat application.
