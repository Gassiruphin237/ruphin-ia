import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3 items-start", isUser && "flex-row-reverse")}>
      <Avatar className="w-8 h-8 shrink-0">
        <AvatarFallback className={cn("text-white text-xs", isUser ? "bg-slate-500" : "bg-indigo-600")}>
          {isUser ? <User size={14} /> : <Bot size={14} />}
        </AvatarFallback>
      </Avatar>

      <div
        className="max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm backdrop-blur-sm"
        style={{
          background: isUser ? "var(--msg-user-bg)" : "var(--msg-bot-bg)",
          color: isUser ? "var(--msg-user-text)" : "var(--msg-bot-text)",
          border: isUser ? "none" : "1px solid var(--msg-bot-border)",
          borderRadius: isUser ? "1rem 0.25rem 1rem 1rem" : "0.25rem 1rem 1rem 1rem",
        }}
      >
        {message.content || (
          <span className="flex gap-1 items-center opacity-40">
            <span className="animate-bounce">●</span>
            <span className="animate-bounce [animation-delay:0.1s]">●</span>
            <span className="animate-bounce [animation-delay:0.2s]">●</span>
          </span>
        )}
      </div>
    </div>
  );
}