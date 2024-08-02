"use client";

import { useEffect } from "react";
import { ContactProfile } from "../contact-profile";
import { ChatOptions } from "./chat-options";
import { InputMessage } from "./input-message";
import { MessageList } from "./message";
import { useChat } from "@/hook/useChat";
import { Message } from "@/types/message";

export function Chat() {
  const {
    users,
    username,
    messages,
    setMessages,
    notifications,
    setNotifications,
  } = useChat();
  console.log("notifications: ", notifications);

  // useEffect(() => {
  //   if (notifications.length > 0) {
  //     // Transformar as notificações em mensagens
  //     const newMessages: Message[] = notifications.map((notification) => ({
  //       id: Date.now(), // Use a lógica de geração de ID apropriada
  //       text: notification.text,
  //       author: "notification",
  //       roomName: notification.roomName,
  //     }));

  //     // Adicionar as mensagens ao estado
  //     setMessages((prevMessages) => [...prevMessages, ...newMessages]);

  //     // Remover as notificações processadas
  //     setNotifications([]);
  //   }
  // }, [notifications, setMessages, setNotifications]);
  useEffect(() => {
    if (notifications.length > 0) {
      // Log para depuração
      console.log("Notificações recebidas: ", notifications);

      // Pegue a última notificação
      const latestNotification = notifications[notifications.length - 1];

      // Transformar a notificação em mensagem
      const newMessage: Message = {
        id: Date.now(), // Use a lógica de geração de ID apropriada
        text: latestNotification.text,
        author: "notification",
        roomName: latestNotification.roomName,
      };

      // Adicionar a mensagem ao estado
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Remover a notificação processada
      setNotifications((prevNotifications) => prevNotifications.slice(0, -1));
    }
  }, [notifications, setMessages, setNotifications]);

  return (
    <div className="flex flex-col justify-between w-[800px] h-[600px] border-2 border-primary rounded-lg">
      <div className="flex justify-between items-center p-8">
        <ChatOptions users={users} />
      </div>
      <MessageList messages={messages} currentUser={username} />
      <InputMessage placceholder="Digite sua menssagem" />
    </div>
  );
}
