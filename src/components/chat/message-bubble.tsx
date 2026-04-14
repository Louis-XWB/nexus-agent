import { cn } from "@/lib/utils";
import { Bot, User, Zap } from "lucide-react";

interface MessageBubbleProps { role: "user" | "assistant"; content: string; toolCalls?: { name: string; input: unknown }[]; isStreaming?: boolean; }

export function MessageBubble({ role, content, toolCalls, isStreaming }: MessageBubbleProps) {
  return (
    <div className={cn("flex gap-3 animate-fade-in", role === "user" && "flex-row-reverse")}>
      {/* Avatar */}
      <div className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
        role === "user"
          ? "bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20"
          : "bg-gradient-to-br from-purple-600 to-violet-700 shadow-lg shadow-purple-500/20"
      )}>
        {role === "user"
          ? <User className="h-4 w-4 text-white" />
          : <Bot className="h-4 w-4 text-white" />}
      </div>

      {/* Bubble */}
      <div className={cn(
        "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
        role === "user"
          ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-sm shadow-md shadow-blue-900/30"
          : "bg-[hsl(223_47%_13%)] border border-border rounded-tl-sm"
      )}>
        {toolCalls && toolCalls.length > 0 && (
          <div className="mb-2.5 space-y-1">
            {toolCalls.map((tc, i) => (
              <div key={i} className="flex items-center gap-2 text-xs bg-black/20 rounded-lg px-2.5 py-1.5 border border-white/[0.06]">
                <Zap className="h-3 w-3 text-yellow-400 shrink-0" />
                <span className="font-mono text-muted-foreground">{tc.name}</span>
              </div>
            ))}
          </div>
        )}
        <div className="whitespace-pre-wrap leading-relaxed">{content}</div>
        {isStreaming && (
          <span className="inline-flex gap-0.5 ml-1 align-middle">
            <span className="typing-dot w-1 h-1 rounded-full bg-current opacity-60" />
            <span className="typing-dot w-1 h-1 rounded-full bg-current opacity-60" />
            <span className="typing-dot w-1 h-1 rounded-full bg-current opacity-60" />
          </span>
        )}
      </div>
    </div>
  );
}
