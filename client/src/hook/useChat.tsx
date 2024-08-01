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

interface ChatContextType {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (event: React.FormEvent) => void;
  messages: Message[];
  username: string;
  usernameRef: React.RefObject<HTMLInputElement>;
  handleUserSubmit: () => void;
  users: User[];
  nameRoomRef: React.RefObject<HTMLInputElement>;
  handleRoomSubmit: () => void;
  rooms: string[];
  currentRoom: string | null;
  joinRoom: (roomName: string) => void;
  leaveRoom: () => void;
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

    socket.on("room_joined", (roomName: string) => {
      setCurrentRoom(roomName);
      setMessages([]);
    });

    socket.on("room_left", () => {
      setCurrentRoom(null);
      setMessages([]);
    });

    return () => {
      socket.off("receive_message");
      socket.off("user_connected");
      socket.off("user_disconnected");
      socket.off("room_list");
      socket.off("room_joined");
      socket.off("room_left");
    };
  }, [currentRoom]);

  const handleUserSubmit = () => {
    const username = usernameRef.current?.value;
    if (username) {
      setUsername(username);
      socket.emit("set_username", username);
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

  const handleRoomSubmit = () => {
    const roomName = nameRoomRef.current?.value;
    if (roomName) {
      socket.emit("create_room", roomName);
      setCurrentRoom(roomName);
      router.push("/login");
    }
  };

  const joinRoom = (roomName: string) => {
    socket.emit("join_room", roomName);
    setCurrentRoom(roomName);
  };

  const leaveRoom = () => {
    if (currentRoom) {
      socket.emit("leave_room", currentRoom);
      setCurrentRoom(null);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        message,
        setMessage,
        handleSubmit,
        messages,
        username,
        usernameRef,
        handleUserSubmit,
        users,
        nameRoomRef,
        handleRoomSubmit,
        rooms,
        currentRoom,
        joinRoom,
        leaveRoom,
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
