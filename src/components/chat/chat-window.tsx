"use client";

import { useState, useRef, useEffect } from "react";
import { MessageBubble } from "./message-bubble";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot } from "lucide-react";

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
        for (const line of decoder.decode(value).split("\n\n")) {
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
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-2xl mx-auto">
          {messages.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-violet-500 mb-5">
                <Bot className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-xl font-semibold mb-1">Chat with Nexus</h2>
              <p className="text-sm text-muted-foreground mb-8">Ask about tokens, execute trades, check your portfolio</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {["What tokens are trending?", "Check my portfolio", "What are whales buying?"].map((q) => (
                  <button key={q} onClick={() => setInput(q)}
                    className="rounded-full border border-border bg-white px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:shadow-sm">
                    {q}
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
      <div className="border-t border-border p-4">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2 max-w-2xl mx-auto">
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask Nexus anything..." disabled={isLoading} className="flex-1 rounded-full h-10 px-4" />
          <Button type="submit" disabled={isLoading || !input.trim()} className="rounded-full h-10 w-10 p-0 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600">
            <Send className="h-4 w-4 text-white" />
          </Button>
        </form>
      </div>
    </div>
  );
}
