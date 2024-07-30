"use client";

import { ContactProfile } from "../contact-profile";
import { ChatOptions } from "./chat-options";
import { InputMessage } from "./input-message";

export function Chat() {
  return (
    <div className="w-[800px] h-full border-2 border-primary rounded-lg">
      <div className="flex justify-between items-center p-8">
        <ContactProfile username={"Henrique Eduardo"} />
        <ChatOptions />
      </div>
      <InputMessage placceholder="Menssage" isInputMenssage={true} />
    </div>
  );
}
