import { Rooms } from "./rooms/page";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center w-full min-h-screen p-24">
      <Rooms />
    </main>
  );
}
