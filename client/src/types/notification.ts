import { Room } from "./room";

export interface Notifications {
  id: number;
  text: string;
  author: string;
  roomName: Room["name"];
}
