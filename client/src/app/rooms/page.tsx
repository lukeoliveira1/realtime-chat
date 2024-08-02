"use client";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useChat } from "@/hook/useChat";

export function Rooms() {
  const { rooms, nameRoomRef, handleCreateOrJoinRoom } = useChat();

  return (
    <main className="flex justify-between items-center w-fit max-h-screen gap-16">
      <div className="flex flex-col justify-center items-center gap-6">
        <h1 className="text-4xl font-medium text-center">
          Bem-vindo ao nosso chat!
          <br />
          Digite o nome da sua sala:
        </h1>
        <Input
          type="text"
          ref={nameRoomRef}
          placeholder="Nome da sala"
          className="w-[300px] "
        />
        <Button size={"lg"} onClick={() => handleCreateOrJoinRoom()}>
          Criar sala
        </Button>
      </div>

      <div className="w-1 h-[400px] border-[1px] border-gray-300 " />

      <div className="flex flex-col justify-center items-center ">
        <h1 className="text-4xl text-center font-medium mb-4">
          Salas existentes:
        </h1>
        {rooms.length === 0 ? (
          <p>Nenhuma sala disponível.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {rooms.map((room, index) => (
              <Button
                key={index}
                className="w-[300px]"
                onClick={() => handleCreateOrJoinRoom(room)}
              >
                {room}
              </Button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
