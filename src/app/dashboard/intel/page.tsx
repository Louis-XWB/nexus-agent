"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Copy, Check, TrendingUp, Fish, Brain, Shield, GitCompare, Loader2, ShieldAlert, CheckCircle2, ExternalLink } from "lucide-react";

const endpoints = [
  { id: "trending", path: "/api/intel/trending", price: "$0.01", title: "Trending Tokens", description: "Top 20 trending tokens with price, volume, market cap", icon: TrendingUp, bg: "bg-gradient-to-br from-blue-50 to-indigo-50", iconBg: "bg-white shadow-sm shadow-blue-100", iconColor: "text-blue-500", curl: `curl -H "x-payment: <SIGNED>" https://your-nexus.app/api/intel/trending` },
  { id: "whale-moves", path: "/api/intel/whale-moves", price: "$0.02", title: "Whale Movements", description: "Real-time whale transactions exceeding $100K", icon: Fish, bg: "bg-gradient-to-br from-violet-50 to-purple-50", iconBg: "bg-white shadow-sm shadow-violet-100", iconColor: "text-violet-500", curl: `curl -H "x-payment: <SIGNED>" https://your-nexus.app/api/intel/whale-moves` },
  { id: "smart-money", path: "/api/intel/smart-money", price: "$0.05", title: "Smart Money Signals", description: "Smart money activity and top trader leaderboard", icon: Brain, bg: "bg-gradient-to-br from-emerald-50 to-teal-50", iconBg: "bg-white shadow-sm shadow-emerald-100", iconColor: "text-emerald-500", curl: `curl -H "x-payment: <SIGNED>" https://your-nexus.app/api/intel/smart-money` },
  { id: "token-risk", path: "/api/intel/token-risk/:address", price: "$0.01", title: "Token Risk Scanner", description: "Honeypot detection, dev history, rug pull risk score", icon: Shield, bg: "bg-gradient-to-br from-amber-50 to-orange-50", iconBg: "bg-white shadow-sm shadow-amber-100", iconColor: "text-amber-500", curl: `curl -H "x-payment: <SIGNED>" https://your-nexus.app/api/intel/token-risk/0x...` },
  { id: "best-route", path: "/api/intel/best-route", price: "$0.03", title: "Cross-DEX Router", description: "Compare OKX DEX (500+ sources) vs Uniswap for best price", icon: GitCompare, bg: "bg-gradient-to-br from-pink-50 to-rose-50", iconBg: "bg-white shadow-sm shadow-pink-100", iconColor: "text-pink-500", curl: `curl -H "x-payment: <SIGNED>" "https://your-nexus.app/api/intel/best-route?from=0x...&to=0x...&amount=1000000"` },
];

export default function IntelPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);
  const [tryResult, setTryResult] = useState<Record<string, { status: number; loading: boolean }>>({});

  function handleCopy(text: string, id: string) { navigator.clipboard.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 2000); }
  async function handleTryIt(ep: typeof endpoints[0]) {
    setTryResult((prev) => ({ ...prev, [ep.id]: { status: 0, loading: true } }));
    try { const res = await fetch(ep.path.replace(":address", "0x0000000000000000000000000000000000000000")); setTryResult((prev) => ({ ...prev, [ep.id]: { status: res.status, loading: false } })); }
    catch { setTryResult((prev) => ({ ...prev, [ep.id]: { status: 500, loading: false } })); }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Intelligence Market</h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">On-chain intelligence APIs powered by x402 micropayments</p>
      </div>

      {/* Hero */}
      <div className="card-colored bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 p-7">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-xl bg-white shadow-sm shadow-violet-100 flex items-center justify-center">
            <Zap className="h-5 w-5 text-violet-500" />
          </div>
          <h2 className="text-lg font-bold">Powered by x402 Protocol</h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-lg mb-4">Pay-per-query with USDT on X Layer. No API keys, no subscriptions. Just send a signed payment and get instant access.</p>
        <div className="flex gap-6 text-[13px] font-medium text-foreground/60">
          <span>From $0.01/query</span>
          <span>No API keys</span>
          <span>5 endpoints</span>
        </div>
      </div>

      {/* How it works */}
      <div className="card-elevated p-6">
        <h3 className="text-sm font-bold mb-5">How x402 Payment Works</h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            { step: "1", title: "Request", desc: "Call any endpoint", bg: "bg-blue-50", color: "text-blue-600" },
            { step: "2", title: "HTTP 402", desc: "Get payment requirements", bg: "bg-amber-50", color: "text-amber-600" },
            { step: "3", title: "Sign & Pay", desc: "Authorize with wallet", bg: "bg-violet-50", color: "text-violet-600" },
            { step: "4", title: "Get Data", desc: "Receive intelligence", bg: "bg-emerald-50", color: "text-emerald-600" },
          ].map((s, i) => (
            <div key={s.step} className="text-center relative">
              {i < 3 && <div className="hidden md:block absolute top-5 -right-2 text-foreground/10 text-lg">&rarr;</div>}
              <div className={`w-10 h-10 rounded-2xl ${s.bg} flex items-center justify-center mx-auto mb-2.5`}>
                <span className={`text-base font-bold font-mono ${s.color}`}>{s.step}</span>
              </div>
              <div className="text-[13px] font-semibold mb-0.5">{s.title}</div>
              <div className="text-[11px] text-muted-foreground">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Endpoints */}
      <div>
        <h3 className="text-sm font-bold mb-4">Available Endpoints</h3>
        <div className="space-y-3">
          {endpoints.map((ep) => {
            const Icon = ep.icon;
            const isExpanded = selectedEndpoint === ep.id;
            return (
              <div key={ep.id} className="card-elevated overflow-hidden">
                <div className="flex items-center gap-4 p-5 cursor-pointer" onClick={() => setSelectedEndpoint(isExpanded ? null : ep.id)}>
                  <div className={`card-colored ${ep.bg} p-3 rounded-2xl`}>
                    <div className={`${ep.iconBg} h-10 w-10 rounded-xl flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${ep.iconColor}`} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[14px] font-semibold">{ep.title}</h4>
                    <p className="text-[12px] text-muted-foreground mt-0.5">{ep.description}</p>
                  </div>
                  <span className="text-sm font-bold font-mono text-foreground/70">{ep.price}</span>
                  <svg className={`h-4 w-4 text-foreground/20 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {isExpanded && (
                  <div className="border-t border-black/[0.04] px-5 pb-5 pt-4 space-y-3 bg-[#fafafa]">
                    <div>
                      <p className="text-[11px] font-semibold text-foreground/40 uppercase tracking-wider mb-1">Endpoint</p>
                      <code className="text-sm font-mono text-pink-500">{ep.path}</code>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-foreground/40 uppercase tracking-wider mb-1">Example</p>
                      <div className="card-inner p-3 flex items-start gap-2">
                        <code className="text-xs font-mono text-muted-foreground flex-1 break-all">{ep.curl}</code>
                        <Button variant="ghost" size="sm" className="shrink-0 h-7" onClick={(e) => { e.stopPropagation(); handleCopy(ep.curl, ep.id); }}>
                          {copied === ep.id ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm" className="text-xs rounded-xl" disabled={tryResult[ep.id]?.loading} onClick={(e) => { e.stopPropagation(); handleTryIt(ep); }}>
                        {tryResult[ep.id]?.loading ? <><Loader2 className="h-3 w-3 mr-1.5 animate-spin" />Calling...</> : <><Zap className="h-3 w-3 mr-1.5" />Try without payment</>}
                      </Button>
                      {tryResult[ep.id] && !tryResult[ep.id].loading && (
                        <span className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl ${tryResult[ep.id].status === 402 ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"}`}>
                          {tryResult[ep.id].status === 402 ? <><ShieldAlert className="h-3.5 w-3.5" /> 402 — x402 working</> : <>Error</>}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="card-elevated p-6 text-center">
        <p className="text-sm text-muted-foreground mb-3">Integrate Nexus intelligence into your agent</p>
        <div className="flex justify-center gap-3">
          <a href="https://www.x402.org" target="_blank" rel="noopener noreferrer"><Button variant="outline" size="sm" className="rounded-xl"><ExternalLink className="h-3 w-3 mr-1.5" />x402 Docs</Button></a>
          <a href="https://github.com/Louis-XWB/nexus-agent" target="_blank" rel="noopener noreferrer"><Button variant="outline" size="sm" className="rounded-xl"><ExternalLink className="h-3 w-3 mr-1.5" />Source</Button></a>
        </div>
      </div>
    </div>
  );
}
