import { Room } from "./room";
export interface Message {
  id: number;
  text: string;
  author: string;
  roomName: Room["name"];
}
