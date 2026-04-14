import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "../db";

interface PaymentRequirement {
  scheme: "exact";
  network: string;
  maxAmountRequired: string;
  resource: string;
  description: string;
  mimeType: string;
  payTo: string;
  maxTimeoutSeconds: number;
  asset: string;
}

const XLAYER_NETWORK = "eip155:196";
const PAY_TO = process.env.X402_PAY_TO_ADDRESS || process.env.AGENT_WALLET_ADDRESS || "";
const USDT_ADDRESS = "0x1E4a5963aBFD975d8c9021ce480b42188849D41d";

export function createPaymentRequirement(priceUSD: string, resource: string, description: string): PaymentRequirement {
  const amountInMinUnits = String(Math.round(parseFloat(priceUSD) * 1_000_000));
  return { scheme: "exact", network: XLAYER_NETWORK, maxAmountRequired: amountInMinUnits, resource, description, mimeType: "application/json", payTo: PAY_TO, maxTimeoutSeconds: 300, asset: USDT_ADDRESS };
}

export function withX402Payment(priceUSD: string, description: string, handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const paymentHeader = req.headers.get("x-payment") || req.headers.get("payment-signature");
    if (!paymentHeader) {
      const requirement = createPaymentRequirement(priceUSD, req.url, description);
      return new NextResponse(JSON.stringify({ error: "Payment Required", accepts: [requirement], description, price: `$${priceUSD}` }), {
        status: 402,
        headers: { "Content-Type": "application/json", "X-Payment-Required": Buffer.from(JSON.stringify({ accepts: [requirement] })).toString("base64") },
      });
    }
    try {
      const paymentData = JSON.parse(Buffer.from(paymentHeader, "base64").toString());
      await db.insert(schema.x402Transactions).values({ endpoint: req.url, payerAddress: paymentData.from || "unknown", amount: priceUSD, txHash: paymentData.txHash || null, status: "settled" });
      await db.insert(schema.agentActions).values({ actionType: "x402_EARN", reason: `x402 payment received for ${description}`, amount: parseFloat(priceUSD), status: "success" });
    } catch { /* For demo, allow through */ }
    return handler(req);
  };
}

export async function consumeX402Service(url: string): Promise<unknown> {
  const res = await fetch(url);
  if (res.status !== 402) return res.json();
  const paymentPayload = { from: process.env.AGENT_WALLET_ADDRESS, timestamp: Date.now(), demo: true };
  const paymentHeader = Buffer.from(JSON.stringify(paymentPayload)).toString("base64");
  const paidRes = await fetch(url, { headers: { "x-payment": paymentHeader } });
  await db.insert(schema.agentActions).values({ actionType: "x402_PAY", reason: `Purchased data from ${url}`, amount: 0.01, status: "success" });
  return paidRes.json();
}
