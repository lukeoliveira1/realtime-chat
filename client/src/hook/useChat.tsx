"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { Message } from "@/types/message";
import { socket } from "@/socket";
import { User } from "@/types/user";
import { Notifications } from "@/types/notification";

interface ChatContextType {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (event: React.FormEvent) => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  username: string;
  usernameRef: React.RefObject<HTMLInputElement>;
  userLoginNicknameSubmit: () => void;
  users: User[];
  nameRoomRef: React.RefObject<HTMLInputElement>;
  rooms: string[];
  currentRoom: string | null;
  createOrJoinRoom: (roomName?: string) => void;
  leaveRoom: () => void;
  notifications: Notifications[];
  setNotifications: React.Dispatch<React.SetStateAction<Notifications[]>>;
}

let notificationId = 0;

function generateUniqueId(): number {
  return ++notificationId;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [rooms, setRooms] = useState<string[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notifications[]>([]);

  const usernameRef = useRef<HTMLInputElement>(null);
  const nameRoomRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    socket.on("receive_message", (message: Message) => {
      if (message.roomName === currentRoom) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    socket.on("user_connected", (user: User) => {
      setUsers((prevUsers) => [...prevUsers, user]);
    });

    socket.on("user_disconnected", (userId: string) => {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    });

    socket.on("room_list", (roomList: string[]) => {
      setRooms(roomList);
    });

    socket.on("room_joined", (roomName: string, username: string) => {
      setCurrentRoom(roomName);
      setMessages([]);
      socket.emit("user_list", roomName);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        {
          id: generateUniqueId(),
          text: `${username} entrou na sala ${roomName}`,
          author: "notification",
          roomName: roomName,
        } as Notifications,
      ]);
    });

    socket.on("room_left", (roomName: string, username: string) => {
      setCurrentRoom(null);
      setMessages([]);
      socket.emit("user_list", roomName);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        {
          id: generateUniqueId(),
          text: `${username} saiu da sala ${roomName}`,
          author: "notification",
          roomName: roomName,
        } as Notifications,
      ]);
    });

    socket.on("user_list", (userList: User[]) => {
      setUsers(userList);
    });

    socket.on("error", (message: string) => {
      console.error(message);
    });

    return () => {
      socket.off("receive_message");
      socket.off("user_connected");
      socket.off("user_disconnected");
      socket.off("room_list");
      socket.off("room_joined");
      socket.off("room_left");
      socket.off("user_list");
      socket.off("error");
    };
  }, [currentRoom]);

  const createOrJoinRoom = (nameRoom?: string) => {
    const roomName = nameRoom ? nameRoom : nameRoomRef.current?.value;
    if (roomName) {
      setCurrentRoom(roomName);
      router.push("/login");
    }
  };

  const userLoginNicknameSubmit = () => {
    const username = usernameRef.current?.value;
    if (username) {
      setUsername(username);
      socket.emit("set_username", username);
      socket.emit("join_room", currentRoom);
      router.push("/chat");
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (message.trim() && username && currentRoom) {
      socket.emit("message", { text: message, roomName: currentRoom });
      setMessage("");
    }
  };

  const leaveRoom = () => {
    if (currentRoom) {
      socket.emit("leave_room", currentRoom);
      setCurrentRoom(null);
      setMessages([]);
      router.push("/");
    }
  };

  return (
    <ChatContext.Provider
      value={{
        message,
        setMessage,
        handleSubmit,
        messages,
        setMessages,
        username,
        usernameRef,
        userLoginNicknameSubmit,
        users,
        nameRoomRef,
        rooms,
        currentRoom,
        createOrJoinRoom,
        leaveRoom,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
