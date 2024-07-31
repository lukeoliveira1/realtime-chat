import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { getInitial } from "@/lib/utils";
interface ContactProfileProps {
  image?: string;
  username: string;
}

export function ContactProfile({ image, username }: ContactProfileProps) {
  return (
    <div className="flex items-center w-fit h-fit gap-2">
      <Avatar>
        <AvatarImage src={""} alt="Imagem perfil" />
        <AvatarFallback>{getInitial(username)}</AvatarFallback>
      </Avatar>

      <h1 className="font-semibold">{username}</h1>
    </div>
  );
}
