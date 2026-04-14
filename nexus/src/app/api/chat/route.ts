import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { TOOLS, executeTool } from "@/lib/agent/tools";
import { db, schema } from "@/lib/db";

const anthropic = new Anthropic({
  baseURL: process.env.ANTHROPIC_BASE_URL || undefined,
});

const CHAT_SYSTEM = `You are Nexus, an autonomous AI trading and intelligence agent operating on X Layer (OKX's Ethereum L2).

You can:
- Analyze trending tokens, whale movements, and smart money signals
- Check token security and risk levels
- Compare swap routes across OKX DEX (500+ liquidity sources) and Uniswap
- Execute token swaps with the best available route
- Manage DeFi positions (deposit, withdraw, claim rewards)
- View portfolio holdings and P&L

Be concise and data-driven. When showing token data, format it clearly.
When executing trades, always explain the route comparison and security check results.
For prices, use USD formatting. For addresses, show shortened form.`;

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  await db.insert(schema.chatMessages).values({ role: "user", content: message });

  const history = await db.select().from(schema.chatMessages).orderBy(schema.chatMessages.id).limit(20);
  const messages: Anthropic.MessageParam[] = history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let currentMessages = [...messages];
      let fullResponse = "";

      while (true) {
        const response = await anthropic.messages.create({
          model: "claude-sonnet-4-6", max_tokens: 4096, system: CHAT_SYSTEM, tools: TOOLS, messages: currentMessages,
        });

        const toolUseBlocks = response.content.filter((b) => b.type === "tool_use");
        const textBlocks = response.content.filter((b) => b.type === "text");

        for (const block of textBlocks) {
          if (block.type === "text") {
            fullResponse += block.text;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "text", content: block.text })}\n\n`));
          }
        }

        if (toolUseBlocks.length === 0 || response.stop_reason === "end_turn") break;

        const toolResults: Anthropic.MessageParam = {
          role: "user",
          content: await Promise.all(
            toolUseBlocks.map(async (block) => {
              if (block.type !== "tool_use") return null;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "tool_call", name: block.name, input: block.input })}\n\n`));
              const result = await executeTool(block.name, block.input as Record<string, unknown>);
              return { type: "tool_result" as const, tool_use_id: block.id, content: result };
            })
          ).then((r) => r.filter(Boolean) as Anthropic.ToolResultBlockParam[]),
        };

        currentMessages = [...currentMessages, { role: "assistant" as const, content: response.content }, toolResults];
      }

      await db.insert(schema.chatMessages).values({ role: "assistant", content: fullResponse });
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
  });
}
