import { cn } from "@/lib/utils";
import { Bot, User, Zap } from "lucide-react";

interface MessageBubbleProps { role: "user" | "assistant"; content: string; toolCalls?: { name: string; input: unknown }[]; isStreaming?: boolean; }

export function MessageBubble({ role, content, toolCalls, isStreaming }: MessageBubbleProps) {
  return (
    <div className={cn("flex gap-3", role === "user" && "flex-row-reverse")}>
      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
        role === "user" ? "bg-foreground" : "bg-gradient-to-br from-pink-500 to-violet-500")}>
        {role === "user" ? <User className="h-4 w-4 text-background" /> : <Bot className="h-4 w-4 text-white" />}
      </div>
      <div className={cn("max-w-[75%] rounded-2xl px-4 py-3",
        role === "user" ? "bg-foreground text-background" : "bg-secondary")}>
        {toolCalls && toolCalls.length > 0 && (
          <div className="mb-2 space-y-1">
            {toolCalls.map((tc, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px] text-muted-foreground bg-background/60 rounded-md px-2 py-0.5">
                <Zap className="h-2.5 w-2.5 text-amber-500" />
                <span className="font-mono">{tc.name}</span>
              </div>
            ))}
          </div>
        )}
        <div className="text-[13px] whitespace-pre-wrap leading-relaxed">{content}</div>
        {isStreaming && <span className="inline-block w-1.5 h-4 bg-foreground/30 animate-pulse ml-0.5 rounded-sm" />}
      </div>
    </div>
  );
}
