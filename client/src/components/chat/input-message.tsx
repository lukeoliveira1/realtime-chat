"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizonal } from "lucide-react";
import { useChat } from "@/hook/useChat";

interface InputMessageProps {
  placceholder?: string;
}

export function InputMessage({ placceholder }: InputMessageProps) {
  const { message, setMessage, handleMessageSubmit } = useChat();

  return (
    <form
      onSubmit={handleMessageSubmit}
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
