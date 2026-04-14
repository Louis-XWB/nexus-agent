import { cn } from "@/lib/utils";
import { Bot, User, Zap } from "lucide-react";

interface MessageBubbleProps { role: "user" | "assistant"; content: string; toolCalls?: { name: string; input: unknown }[]; isStreaming?: boolean; }

export function MessageBubble({ role, content, toolCalls, isStreaming }: MessageBubbleProps) {
  return (
    <div className={cn("flex gap-3 animate-fade-in", role === "user" && "flex-row-reverse")}>
      {/* Avatar */}
      <div className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl shadow-lg",
        role === "user"
          ? "bg-gradient-to-br from-blue-500 to-purple-600 shadow-blue-500/20"
          : "bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/20 shadow-purple-500/10"
      )}>
        {role === "user"
          ? <User className="h-4 w-4 text-white" />
          : <Bot className="h-4 w-4 text-purple-400" />
        }
      </div>

      {/* Bubble */}
      <div className={cn(
        "max-w-[80%] rounded-2xl px-4 py-3",
        role === "user"
          ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/10"
          : "glass-subtle"
      )}>
        {/* Tool call chips */}
        {toolCalls && toolCalls.length > 0 && (
          <div className="mb-2.5 space-y-1.5">
            {toolCalls.map((tc, i) => (
              <div key={i} className={cn(
                "inline-flex items-center gap-2 text-xs rounded-lg px-2.5 py-1.5 mr-1",
                role === "user"
                  ? "bg-white/10 text-white/80"
                  : "bg-amber-500/10 border border-amber-500/15 text-amber-400"
              )}>
                <Zap className="h-3 w-3 text-amber-400" />
                <span className="font-mono font-medium">{tc.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <div className={cn(
          "text-sm whitespace-pre-wrap leading-relaxed",
          role === "user" ? "text-white" : "text-slate-300"
        )}>
          {content}
        </div>

        {/* Streaming cursor */}
        {isStreaming && (
          <span className="inline-flex items-center gap-0.5 ml-1 mt-0.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" style={{ animation: "dotPulse 1s ease-in-out infinite" }} />
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" style={{ animation: "dotPulse 1s ease-in-out infinite 0.2s" }} />
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" style={{ animation: "dotPulse 1s ease-in-out infinite 0.4s" }} />
          </span>
        )}
      </div>
    </div>
  );
}
