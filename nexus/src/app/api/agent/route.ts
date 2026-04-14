import { NextRequest, NextResponse } from "next/server";
import { runAgentLoop } from "@/lib/agent/loop";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const expectedToken = process.env.AGENT_CRON_SECRET;
  if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await runAgentLoop();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Agent loop error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
