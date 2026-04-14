import { cn } from "@/lib/utils";
import { Bot, User, Zap } from "lucide-react";

interface MessageBubbleProps { role: "user" | "assistant"; content: string; toolCalls?: { name: string; input: unknown }[]; isStreaming?: boolean; }

export function MessageBubble({ role, content, toolCalls, isStreaming }: MessageBubbleProps) {
  return (
    <div className={cn("flex gap-3", role === "user" && "flex-row-reverse")}>
      <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
        role === "user" ? "bg-primary" : "bg-secondary")}>
        {role === "user" ? <User className="h-3.5 w-3.5 text-primary-foreground" /> : <Bot className="h-3.5 w-3.5 text-foreground" />}
      </div>
      <div className={cn("max-w-[80%] rounded-lg px-3.5 py-2.5",
        role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary")}>
        {toolCalls && toolCalls.length > 0 && (
          <div className="mb-2 space-y-1">
            {toolCalls.map((tc, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px] text-muted-foreground bg-background/50 rounded px-2 py-0.5">
                <Zap className="h-2.5 w-2.5 text-amber-400" />
                <span className="font-mono">{tc.name}</span>
              </div>
            ))}
          </div>
        )}
        <div className="text-sm whitespace-pre-wrap leading-relaxed">{content}</div>
        {isStreaming && <span className="inline-block w-1.5 h-3.5 bg-foreground/50 animate-pulse ml-0.5" />}
      </div>
    </div>
  );
}
