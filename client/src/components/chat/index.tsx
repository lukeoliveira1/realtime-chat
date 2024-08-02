"use client";

import { ContactProfile } from "../contact-profile";
import { ChatOptions } from "./chat-options";
import { InputMessage } from "./input-message";
import { MessageList } from "./message";
import { useChat } from "@/hook/useChat";

export function Chat() {
  const { users, username, messages } = useChat();

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
