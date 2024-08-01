"use client";

import { ContactProfile } from "../contact-profile";
import { ChatOptions } from "./chat-options";
import { InputMessage } from "./input-message";
import { MessageList } from "./message";
import { useChat } from "@/hook/useChat";

export function Chat() {
  const { users, username, messages } = useChat();
  const { leaveRoom } = useChat();

  return (
    <div className="flex flex-col justify-between w-[800px] h-[600px] border-2 border-primary rounded-lg">
      <div className="flex justify-start m-5">
        <button onClick={() => leaveRoom()}>Voltar</button>
      </div>
      <div className="flex justify-between items-center p-8">
        <div className="flex flex-col items-start">
          {users.map((user) => (
            <ContactProfile key={user.id} username={user.username} />
          ))}
        </div>
        <ChatOptions />
      </div>
      <MessageList messages={messages} currentUser={username} />
      <InputMessage placceholder="Menssage" />
    </div>
  );
}
