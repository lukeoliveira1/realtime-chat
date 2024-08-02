import { cn } from "@/lib/utils";
import { Message } from "@/types/message";
import { Notifications } from "@/types/notification";

interface MessageListProps {
  messages: Message[] | Notifications[];
  currentUser: string;
}

export function MessageList({ messages, currentUser }: MessageListProps) {
  const notifications = messages.filter(
    (msg) => msg.author === "notification"
  ) as Notifications[];
  const chatMessages = messages.filter(
    (msg) => msg.author !== "notification"
  ) as Message[];

  // Combine notifications and messages (notifications first)
  const sortedMessages = [...notifications, ...chatMessages];

  return (
    <div className="flex-1 overflow-auto p-4">
      {sortedMessages.length === 0 ? (
        <p className="text-center text-gray-500">Nenhuma mensagem ainda...</p>
      ) : (
        <div>
          {sortedMessages.map((message) => (
            <div
              key={message.id}
              className={cn([
                "mb-2 px-6 py-2 rounded-lg",
                message.author === "notification"
                  ? "bg-blue-100 text-center mx-auto"
                  : message.author === currentUser
                  ? "bg-green-400 text-right"
                  : "bg-gray-200 text-left",
                "w-fit",
              ])}
              style={
                message.author === "notification"
                  ? { width: "fit-content" }
                  : {}
              }
            >
              {message.author !== "notification" && (
                <h1 className="font-bold">{message.author}</h1>
              )}
              <p>{message.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
