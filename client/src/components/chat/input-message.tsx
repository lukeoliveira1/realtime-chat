"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizonal } from "lucide-react";
import { socket } from "@/socket";

interface InputMessageProps {
  placceholder?: string;
  isInputMenssage: boolean;
}

export function InputMessage({
  placceholder,
  isInputMenssage,
}: InputMessageProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (message.trim()) {
      socket.emit("message", message);
    }
    setMessage("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex justify-between items-center gap-4 px-8 py-4"
    >
      <Input
        type="text"
        placeholder={placceholder}
        onChange={(event) => setMessage(event.target.value)}
        value={message}
        className="w-full"
      />
      <Button type="submit">
        <SendHorizonal size={24} />
      </Button>
    </form>
  );
}
