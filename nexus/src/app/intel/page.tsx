"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Copy,
  Check,
  TrendingUp,
  Fish,
  Brain,
  Shield,
  GitCompare,
  CircleDollarSign,
  Lock,
  ExternalLink,
} from "lucide-react";

const endpoints = [
  {
    id: "trending",
    path: "/api/intel/trending",
    price: "$0.01",
    title: "Trending Tokens",
    description: "Top 20 trending tokens with price, volume, market cap",
    icon: TrendingUp,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    curl: `curl -H "x-payment: <SIGNED>" https://your-nexus.app/api/intel/trending`,
  },
  {
    id: "whale-moves",
    path: "/api/intel/whale-moves",
    price: "$0.02",
    title: "Whale Movements",
    description: "Real-time whale transactions exceeding $100K",
    icon: Fish,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    curl: `curl -H "x-payment: <SIGNED>" https://your-nexus.app/api/intel/whale-moves`,
  },
  {
    id: "smart-money",
    path: "/api/intel/smart-money",
    price: "$0.05",
    title: "Smart Money Signals",
    description: "Smart money activity and top trader leaderboard",
    icon: Brain,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    curl: `curl -H "x-payment: <SIGNED>" https://your-nexus.app/api/intel/smart-money`,
  },
  {
    id: "token-risk",
    path: "/api/intel/token-risk/:address",
    price: "$0.01",
    title: "Token Risk Scanner",
    description: "Honeypot detection, dev history, rug pull risk score",
    icon: Shield,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    curl: `curl -H "x-payment: <SIGNED>" https://your-nexus.app/api/intel/token-risk/0x...`,
  },
  {
    id: "best-route",
    path: "/api/intel/best-route",
    price: "$0.03",
    title: "Cross-DEX Router",
    description: "Compare OKX DEX (500+ sources) vs Uniswap for best price",
    icon: GitCompare,
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/20",
    curl: `curl -H "x-payment: <SIGNED>" "https://your-nexus.app/api/intel/best-route?from=0x...&to=0x...&amount=1000000"`,
  },
];

export default function IntelPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);

  function handleCopy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Intelligence Market</h1>
        <p className="text-muted-foreground mt-1">
          On-chain intelligence APIs powered by x402 micropayments
        </p>
      </div>

      {/* Hero Banner */}
      <Card className="overflow-hidden border-primary/20">
        <div className="bg-gradient-to-br from-blue-950/80 via-purple-950/60 to-indigo-950/80 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.15),transparent_50%)]" />
          <CardContent className="p-8 relative">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">Powered by x402 Protocol</h2>
                </div>
                <p className="text-muted-foreground max-w-lg">
                  Pay-per-query with USDT on X Layer. No API keys, no subscriptions.
                  Just send a signed payment and get instant access.
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CircleDollarSign className="h-4 w-4 text-green-400" />
                    <span className="text-green-400 font-medium">From $0.01/query</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Lock className="h-4 w-4 text-blue-400" />
                    <span className="text-blue-400 font-medium">No API keys</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="h-4 w-4 text-purple-400" />
                    <span className="text-purple-400 font-medium">5 endpoints</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* How it works */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">How x402 Payment Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Request", desc: "Call any endpoint without payment", color: "text-blue-400", bg: "bg-blue-500/10" },
              { step: "2", title: "HTTP 402", desc: "Server returns payment requirements", color: "text-amber-400", bg: "bg-amber-500/10" },
              { step: "3", title: "Sign & Pay", desc: "Sign authorization with your wallet", color: "text-purple-400", bg: "bg-purple-500/10" },
              { step: "4", title: "Get Data", desc: "Retry with payment, receive intel", color: "text-green-400", bg: "bg-green-500/10" },
            ].map((s, i) => (
              <div key={s.step} className="flex flex-col items-center text-center relative">
                {i < 3 && (
                  <div className="hidden md:block absolute top-5 -right-3 text-muted-foreground/30 text-lg">
                    &rarr;
                  </div>
                )}
                <div className={`w-10 h-10 rounded-full ${s.bg} flex items-center justify-center mb-3`}>
                  <span className={`text-lg font-bold font-mono ${s.color}`}>{s.step}</span>
                </div>
                <div className="font-medium text-sm mb-1">{s.title}</div>
                <div className="text-xs text-muted-foreground">{s.desc}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Endpoints */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Available Endpoints</h3>
        <div className="space-y-3">
          {endpoints.map((ep) => {
            const Icon = ep.icon;
            const isExpanded = selectedEndpoint === ep.id;
            return (
              <Card
                key={ep.id}
                className="bg-card border-border transition-all hover:border-primary/30"
              >
                <CardContent className="p-0">
                  {/* Main row - always visible */}
                  <div
                    className="flex items-center gap-4 p-4 cursor-pointer"
                    onClick={() => setSelectedEndpoint(isExpanded ? null : ep.id)}
                  >
                    <div className={`p-2.5 rounded-lg ${ep.bgColor} shrink-0`}>
                      <Icon className={`h-5 w-5 ${ep.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm">{ep.title}</h4>
                        <Badge variant="outline" className="font-mono text-[10px] px-1.5 py-0">
                          GET
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{ep.description}</p>
                    </div>
                    <Badge className={`${ep.bgColor} ${ep.color} ${ep.borderColor} border font-mono text-sm px-3 shrink-0`}>
                      {ep.price}
                    </Badge>
                    <div className="text-muted-foreground shrink-0">
                      <svg className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="border-t border-border px-4 pb-4 pt-3 space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1.5">Endpoint</p>
                        <code className="text-sm font-mono text-primary">{ep.path}</code>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1.5">Example Request</p>
                        <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                          <code className="text-xs font-mono text-muted-foreground flex-1 whitespace-pre-wrap break-all">
                            {ep.curl}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="shrink-0 h-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(ep.curl, ep.id);
                            }}
                          >
                            {copied === ep.id ? (
                              <Check className="h-3 w-3 text-green-400" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1.5">x402 Payment Details</p>
                        <div className="bg-background rounded-lg p-3 space-y-1.5 text-xs font-mono">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Network</span>
                            <span>X Layer (eip155:196)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Token</span>
                            <span>USDT</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Amount</span>
                            <span className={ep.color}>{ep.price}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Scheme</span>
                            <span>exact (EIP-3009)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Footer CTA */}
      <Card className="bg-muted/30 border-border">
        <CardContent className="p-6 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Integrate Nexus intelligence into your agent with a single HTTP call
          </p>
          <div className="flex items-center justify-center gap-3">
            <a href="https://www.x402.org" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-3 w-3 mr-1.5" />
                x402 Protocol Docs
              </Button>
            </a>
            <a href="https://github.com/Louis-XWB/nexus-agent" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-3 w-3 mr-1.5" />
                View Source
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
