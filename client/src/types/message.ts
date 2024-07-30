import { StaticImageData } from "next/image";

export interface MessageProps {
  image: StaticImageData | string;
  name: string;
  message: string;
  isOwner?: boolean;
}
