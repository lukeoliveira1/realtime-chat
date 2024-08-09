"use client";

import { Button } from "@/components/ui/button";
import { Phone, VideoIcon, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { User } from "@/types/user";
import { ContactProfile } from "../contact-profile";
import { useChat } from "@/hook/useChat";
import React from "react";

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

      <div className="flex items-start justify-between">
        {users.map((user, index) => (
          <React.Fragment key={user.id}>
            <ContactProfile username={user.username} />
            {index < users.length - 1 && <span>, </span>}
          </React.Fragment>
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
