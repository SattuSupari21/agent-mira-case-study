import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
}

const ChatMessage = ({ message, isUser }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex gap-3 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
          <Bot className="w-5 h-5 text-primary-foreground" />
        </div>
      )}
      <div
        className={cn(
          "rounded-2xl px-4 py-2.5 max-w-[80%] shadow-[var--shadow-message)]",
          isUser
            ? "bg-[hsl(var(--chat-user-bg))] text-[hsl(var(--chat-user-fg))] rounded-br-md"
            : "bg-[hsl(var(--chat-bot-bg))] text-[hsl(var(--chat-bot-fg))] rounded-bl-md border border-border"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
          {message}
        </p>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
          <User className="w-5 h-5 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
