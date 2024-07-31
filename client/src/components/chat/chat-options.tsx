import { Button } from "@/components/ui/button";
import { Phone, VideoIcon, Search } from "lucide-react";

export function ChatOptions() {
  return (
    <div className="flex gap-1">
      <Button size={"icon"} variant={"secondary"}>
        <Phone size={18} />
      </Button>
      <Button size={"icon"} variant={"secondary"}>
        <VideoIcon size={18} />
      </Button>
      <Button size={"icon"} variant={"secondary"}>
        <Search size={18} />
      </Button>
    </div>
  );
}
