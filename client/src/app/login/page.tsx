"use client";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useChat } from "@/hook/useChat";

export default function Login() {
  const { usernameRef, handleUserLoginSubmit } = useChat();

  return (
    <main className="flex flex-col justify-center items-center w-full h-screen p-8 gap-6">
      <h1 className="text-4xl font-medium">Insira seu nome de usuário:</h1>
      <Input
        type="text"
        ref={usernameRef}
        placeholder="Nome de usuário"
        className="w-[300px]"
      />
      <Button size={"lg"} onClick={handleUserLoginSubmit}>
        Entrar
      </Button>
    </main>
  );
}
