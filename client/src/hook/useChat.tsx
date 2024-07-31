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
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState("");
  const usernameRef = useRef<HTMLInputElement>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    socket.on("receive_message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("user_connected", (user: User) => {
      setUsers((prevUsers) => [...prevUsers, user]);
    });

    socket.on("user_disconnected", (userId: string) => {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    });

    return () => {
      socket.off("receive_message");
      socket.off("user_connected");
      socket.off("user_disconnected");
    };
  }, []);

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
    if (message.trim() && username) {
      socket.emit("message", { text: message });
    }
    setMessage("");
  };

  return (
    <ChatContext.Provider
      value={{
        message,
        setMessage,
        handleSubmit,
        messages,
        users,
        username,
        usernameRef,
        handleUserSubmit,
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
