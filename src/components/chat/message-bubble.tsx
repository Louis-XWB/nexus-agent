import { cn } from "@/lib/utils";
import { Bot, User, Zap } from "lucide-react";

interface MessageBubbleProps { role: "user" | "assistant"; content: string; toolCalls?: { name: string; input: unknown }[]; isStreaming?: boolean; }

export function MessageBubble({ role, content, toolCalls, isStreaming }: MessageBubbleProps) {
  return (
    <div className={cn("flex gap-3", role === "user" && "flex-row-reverse")}>
      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", role === "user" ? "bg-primary" : "bg-purple-600")}>
        {role === "user" ? <User className="h-4 w-4 text-primary-foreground" /> : <Bot className="h-4 w-4 text-white" />}
      </div>
      <div className={cn("max-w-[80%] rounded-lg px-4 py-3", role === "user" ? "bg-primary text-primary-foreground" : "bg-muted")}>
        {toolCalls && toolCalls.length > 0 && (
          <div className="mb-2 space-y-1">{toolCalls.map((tc, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground bg-background/50 rounded px-2 py-1">
              <Zap className="h-3 w-3" /><span className="font-mono">{tc.name}</span>
            </div>
          ))}</div>
        )}
        <div className="text-sm whitespace-pre-wrap">{content}</div>
        {isStreaming && <span className="inline-block w-1.5 h-4 bg-foreground/60 animate-pulse ml-0.5" />}
      </div>
    </div>
  );
}
