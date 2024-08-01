"use client";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useChat } from "@/hook/useChat";

export function Rooms() {
  const { rooms, nameRoomRef, handleRoomSubmit } = useChat();

  return (
    <main className="flex min-h-screen p-24 gap-6">
      {/* Coluna para criar sala */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 border-r-2 border-gray-300">
        <h1 className="text-4xl font-medium mb-4 text-center mb-10">
          Bem-vindo ao nosso chat! <br />
          Digite o nome da sua sala:
        </h1>
        <Input
          type="text"
          ref={nameRoomRef}
          placeholder="Room"
          className="w-[300px] mb-10"
        />
        <Button size={"lg"} onClick={handleRoomSubmit}>
          Criar sala
        </Button>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-6">
        <h1 className="text-4xl font-medium mb-4">Salas existentes:</h1>
        {rooms.length === 0 ? (
          <p>Nenhuma sala disponível.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {rooms.map((room, index) => (
              <Button key={index} className="w-[300px]">
                {room}
              </Button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
