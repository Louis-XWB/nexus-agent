import { cn } from "@/lib/utils";
import { Bot, User, Zap } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface MessageBubbleProps { role: "user" | "assistant"; content: string; toolCalls?: { name: string; input: unknown }[]; isStreaming?: boolean; }

export function MessageBubble({ role, content, toolCalls, isStreaming }: MessageBubbleProps) {
  return (
    <div className={cn("flex gap-3", role === "user" && "flex-row-reverse")}>
      <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl shadow-sm",
        role === "user" ? "bg-gradient-to-br from-pink-500 to-violet-500 shadow-pink-500/15" : "bg-gradient-to-br from-pink-500 to-violet-500 shadow-pink-500/15")}>
        {role === "user" ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
      </div>
      <div className={cn("max-w-[80%] rounded-2xl px-4 py-3",
        role === "user" ? "bg-gradient-to-r from-pink-500 to-violet-500 text-white" : "card-elevated")}>

        {toolCalls && toolCalls.length > 0 && (
          <div className="mb-2.5 space-y-1">
            {toolCalls.map((tc, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px] text-muted-foreground bg-[#f7f7fa] rounded-lg px-2.5 py-1">
                <Zap className="h-2.5 w-2.5 text-amber-500" />
                <span className="font-mono">{tc.name}</span>
              </div>
            ))}
          </div>
        )}
        <div className="text-[13px] leading-relaxed prose prose-sm prose-neutral max-w-none
          prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5
          prose-strong:font-semibold prose-code:text-pink-500 prose-code:bg-pink-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-[12px] prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-[#f7f7fa] prose-pre:rounded-xl prose-pre:text-[12px]
          prose-headings:font-semibold prose-h1:text-base prose-h2:text-sm prose-h3:text-[13px]
          prose-a:text-pink-500 prose-a:no-underline hover:prose-a:underline">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        {isStreaming && <span className="inline-block w-1.5 h-4 bg-foreground/20 animate-pulse ml-0.5 rounded-sm" />}
      </div>
    </div>
  );
}
