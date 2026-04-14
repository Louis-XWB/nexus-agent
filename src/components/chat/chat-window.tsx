"use client";

import { useState, useRef, useEffect } from "react";
import { MessageBubble } from "./message-bubble";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message { role: "user" | "assistant"; content: string; toolCalls?: { name: string; input: unknown }[]; }

const SUGGESTIONS = [
  "What tokens are trending?",
  "Check my portfolio",
  "What are whales buying?",
  "Explain my last trade",
];

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [streamingTools, setStreamingTools] = useState<{ name: string; input: unknown }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, streamingContent]);

  async function handleSend(msg?: string) {
    const userMessage = (msg ?? input).trim();
    if (!userMessage || isLoading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true); setStreamingContent(""); setStreamingTools([]);

    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: userMessage }) });
      const reader = res.body?.getReader(); if (!reader) return;
      const decoder = new TextDecoder();
      let accContent = ""; let accTools: { name: string; input: unknown }[] = [];

      while (true) {
        const { done, value } = await reader.read(); if (done) break;
        const text = decoder.decode(value);
        for (const line of text.split("\n\n")) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === "text") { accContent += data.content; setStreamingContent(accContent); }
            else if (data.type === "tool_call") { accTools = [...accTools, { name: data.name, input: data.input }]; setStreamingTools(accTools); }
            else if (data.type === "done") { setMessages((prev) => [...prev, { role: "assistant", content: accContent, toolCalls: accTools }]); setStreamingContent(""); setStreamingTools([]); }
          } catch { /* skip */ }
        }
      }
    } catch { setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong." }]); }
    setIsLoading(false);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.length === 0 && !streamingContent && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              {/* Branded icon */}
              <div className="relative mb-6">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 flex items-center justify-center shadow-xl shadow-purple-900/20">
                  <Bot className="h-8 w-8 text-blue-400" />
                </div>
                <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </div>
              <h2 className="text-lg font-semibold mb-1.5">Chat with Nexus</h2>
              <p className="text-sm text-muted-foreground mb-8 max-w-xs">
                Ask about tokens, execute trades, check your portfolio, or get DeFi intel.
              </p>
              {/* Suggestion chips */}
              <div className="flex flex-wrap gap-2 justify-center max-w-sm">
                {SUGGESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="text-xs px-3 py-1.5 rounded-full border border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border/80 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => <MessageBubble key={i} role={m.role} content={m.content} toolCalls={m.toolCalls} />)}
          {streamingContent && <MessageBubble role="assistant" content={streamingContent} toolCalls={streamingTools} isStreaming />}

          {/* Typing indicator when loading but no content yet */}
          {isLoading && !streamingContent && (
            <div className="flex gap-3 animate-fade-in">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-violet-700">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-[hsl(223_47%_13%)] border border-border rounded-2xl rounded-tl-sm px-4 py-3.5 flex items-center gap-1">
                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-muted-foreground" />
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="border-t border-border bg-[hsl(224_71%_3.5%)] px-4 py-3.5">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className={cn("flex gap-2 max-w-3xl mx-auto rounded-xl border border-border bg-[hsl(223_47%_7%)] px-3 py-2 transition-all focus-within:border-blue-500/40 focus-within:shadow-sm focus-within:shadow-blue-500/10")}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Nexus anything..."
            disabled={isLoading}
            className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 text-sm placeholder:text-muted-foreground/50 p-0"
          />
          <Button
            type="submit"
            size="sm"
            disabled={isLoading || !input.trim()}
            className="h-7 w-7 p-0 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-30 shrink-0"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
