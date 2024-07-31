"use client";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useChat } from "@/hook/useChat";

export function Login() {
  const { usernameRef, handleUserSubmit } = useChat();

  return (
    <main className="flex flex-col justify-center items-center min-h-screen p-24 gap-6">
      <h1 className="text-4xl font-medium">
        Bem-vindo ao nosso chat, insira seu nickname:
      </h1>
      <Input
        type="text"
        ref={usernameRef}
        placeholder="Username"
        className="w-[300px]"
      />
      <Button size={"lg"} onClick={handleUserSubmit}>
        Entrar
      </Button>
    </main>
  );
}
