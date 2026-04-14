"use client";

import { useState, useRef, useEffect } from "react";
import { MessageBubble } from "./message-bubble";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, Sparkles, ArrowRight } from "lucide-react";

interface Message { role: "user" | "assistant"; content: string; toolCalls?: { name: string; input: unknown }[]; }

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [streamingTools, setStreamingTools] = useState<{ name: string; input: unknown }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, streamingContent]);

  async function handleSend() {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput(""); setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
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

  const suggestions = [
    "What tokens are trending?",
    "Check my portfolio",
    "What are whales buying?",
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.length === 0 && (
            <div className="text-center py-16 animate-fade-in">
              {/* Gradient logo */}
              <div className="relative inline-flex mb-6">
                <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/20">
                  <Bot className="h-10 w-10 text-white" />
                </div>
                <div className="absolute inset-0 h-20 w-20 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 opacity-30 blur-2xl" />
                <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gradient mb-2">Chat with Nexus</h2>
              <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto">
                Your autonomous DeFi agent. Ask about tokens, execute trades, or analyze your portfolio.
              </p>

              {/* Suggestion chips */}
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="group glass-subtle rounded-2xl px-4 py-2.5 text-sm text-slate-400 hover:text-slate-200 hover:border-blue-500/20 hover:shadow-[0_0_20px_rgba(59,130,246,0.08)] transition-all flex items-center gap-2"
                  >
                    {q}
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-400" />
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => <MessageBubble key={i} role={m.role} content={m.content} toolCalls={m.toolCalls} />)}
          {streamingContent && <MessageBubble role="assistant" content={streamingContent} toolCalls={streamingTools} isStreaming />}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="p-4">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="max-w-3xl mx-auto">
          <div className="glass rounded-2xl p-1.5 flex items-center gap-2 shadow-[inset_0_1px_1px_rgba(148,163,184,0.05),0_0_30px_rgba(59,130,246,0.03)]">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Nexus anything..."
              disabled={isLoading}
              className="flex-1 border-0 bg-transparent text-slate-200 placeholder:text-slate-600 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm h-11 px-4"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="h-9 w-9 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 border-0 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all disabled:opacity-30 disabled:shadow-none flex items-center justify-center p-0"
            >
              <Send className="h-4 w-4 text-white" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
