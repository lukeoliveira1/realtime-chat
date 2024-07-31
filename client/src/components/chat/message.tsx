import { cn } from "@/lib/utils";
import { Message } from "@/types/message";

interface MessageListProps {
  messages: Message[];
  currentUser: string;
}

export function MessageList({ messages, currentUser }: MessageListProps) {
  return (
    <div className="flex-1 overflow-auto p-4">
      {messages.length === 0 ? (
        <p className="text-center text-gray-500">No messages yet</p>
      ) : (
        <div>
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn([
                "mb-2 px-6 py-2 rounded-lg",
                message.author === currentUser
                  ? "bg-green-400 text-right"
                  : "bg-gray-200 text-left",
              ])}
            >
              <h1 className="font-bold">{message.author}</h1>
              <p>{message.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
