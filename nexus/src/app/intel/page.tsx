"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Copy } from "lucide-react";

const endpoints = [
  { method: "GET", path: "/api/intel/trending", price: "$0.01", description: "Top trending tokens on X Layer", curl: `curl -H "x-payment: <SIGNED>" https://your-nexus.app/api/intel/trending` },
  { method: "GET", path: "/api/intel/whale-moves", price: "$0.02", description: "Recent whale transactions (>$100K)", curl: `curl -H "x-payment: <SIGNED>" https://your-nexus.app/api/intel/whale-moves` },
  { method: "GET", path: "/api/intel/smart-money", price: "$0.05", description: "Smart money portfolio changes + top traders", curl: `curl -H "x-payment: <SIGNED>" https://your-nexus.app/api/intel/smart-money` },
  { method: "GET", path: "/api/intel/token-risk/:address", price: "$0.01", description: "Token security score and risk details", curl: `curl -H "x-payment: <SIGNED>" https://your-nexus.app/api/intel/token-risk/0x...` },
  { method: "GET", path: "/api/intel/best-route?from=&to=&amount=", price: "$0.03", description: "Cross-DEX optimal route comparison", curl: `curl -H "x-payment: <SIGNED>" "https://your-nexus.app/api/intel/best-route?from=0x...&to=0x...&amount=1000000"` },
];

export default function IntelPage() {
  const [preview, setPreview] = useState<{ status: number; data: unknown } | null>(null);
  const [loading, setLoading] = useState(false);

  async function tryEndpoint(path: string) {
    setLoading(true);
    try { const res = await fetch(path); setPreview({ status: res.status, data: await res.json() }); }
    catch (e) { setPreview({ status: 500, data: { error: String(e) } }); }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Intelligence Market</h1><p className="text-sm text-muted-foreground">x402 micropayment-powered on-chain intelligence APIs</p></div>
      <Card className="bg-gradient-to-r from-blue-950/50 to-purple-950/50 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-2"><Zap className="h-5 w-5 text-primary" /><h2 className="font-semibold">Powered by x402 Protocol</h2></div>
          <p className="text-sm text-muted-foreground">Pay-per-query with USDT on X Layer. No API keys, no subscriptions.</p>
        </CardContent>
      </Card>
      <Tabs defaultValue="endpoints">
        <TabsList><TabsTrigger value="endpoints">API Endpoints</TabsTrigger><TabsTrigger value="try">Try It</TabsTrigger></TabsList>
        <TabsContent value="endpoints" className="space-y-4">
          {endpoints.map((ep) => (
            <Card key={ep.path} className="bg-card border-border"><CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2"><Badge variant="outline" className="font-mono text-xs">{ep.method}</Badge><code className="text-sm font-mono text-primary">{ep.path}</code></div>
                <Badge className="bg-green-500/10 text-green-400 border-green-500/20">{ep.price}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{ep.description}</p>
              <div className="bg-background rounded p-3 flex items-center gap-2">
                <code className="text-xs font-mono text-muted-foreground flex-1 overflow-x-auto">{ep.curl}</code>
                <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(ep.curl)}><Copy className="h-3 w-3" /></Button>
              </div>
            </CardContent></Card>
          ))}
        </TabsContent>
        <TabsContent value="try" className="space-y-4">
          <Card className="bg-card border-border"><CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-4">Click an endpoint to see the x402 payment requirement (402 response):</p>
            <div className="flex flex-wrap gap-2">
              {endpoints.map((ep) => <Button key={ep.path} variant="outline" size="sm" onClick={() => tryEndpoint(ep.path.replace(":address", "0x0000000000000000000000000000000000000000"))} disabled={loading}>{ep.path.split("/").pop()}</Button>)}
            </div>
            {preview && <pre className="mt-4 bg-background rounded p-4 text-xs font-mono overflow-auto max-h-96"><span className="text-muted-foreground">Status: {preview.status}</span>{"\n\n"}{JSON.stringify(preview.data, null, 2)}</pre>}
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
