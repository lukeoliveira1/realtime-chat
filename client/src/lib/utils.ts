import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitial(username: string): string {
  const words = username.trim().split(/\s+/);
  const initials = words.map((word) => word.charAt(0).toUpperCase());
  return initials.join("");
}
