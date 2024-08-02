"use client";

import { Button } from "@/components/ui/button";
import { Phone, VideoIcon, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { User } from "@/types/user";
import { ContactProfile } from "../contact-profile";
import { useChat } from "@/hook/useChat";

interface ContactProfileProps {
  users: User[];
}

export function ChatOptions({ users }: ContactProfileProps) {
  const { handleLeaveRoom } = useChat();

  return (
    <div className="flex justify-between items-center w-full">
      <Button
        onClick={() => {
          handleLeaveRoom();
        }}
        variant={"ghost"}
        size={"icon"}
        className="hover:bg-red-600"
      >
        <ChevronLeft size={24} />
      </Button>

      <div className="flex flex-col items-start">
        {users.map((user) => (
          <ContactProfile key={user.id} username={user.username} />
        ))}
      </div>

      <div className="flex gap-1">
        <Button size={"icon"} variant={"secondary"}>
          <Phone size={18} />
        </Button>
        <Button size={"icon"} variant={"secondary"}>
          <VideoIcon size={18} />
        </Button>
        <Button size={"icon"} variant={"secondary"}>
          <Search size={18} />
        </Button>
      </div>
    </div>
  );
}
