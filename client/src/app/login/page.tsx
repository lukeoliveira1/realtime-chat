"use client";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useChat } from "@/hook/useChat";
import { useRouter } from "next/navigation";

export default function Login() {
  const { usernameRef, handleUserSubmit } = useChat();
  const router = useRouter();

  return (
    <main className="flex flex-col justify-center items-center min-h-screen p-24 gap-6">
      <h1 className="text-4xl font-medium">Insira seu nickname:</h1>
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
