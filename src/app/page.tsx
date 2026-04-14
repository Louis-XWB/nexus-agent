"use client";

import { Bot, ArrowRight, Zap, Shield, GitCompare, TrendingUp, ExternalLink } from "lucide-react";
import Link from "next/link";

const features = [
  { icon: TrendingUp, title: "Autonomous Trading", desc: "AI agent analyzes whale movements, smart money signals, and market trends to make data-driven decisions every 30 minutes", color: "from-pink-50 to-rose-50", iconColor: "text-pink-500", iconBg: "bg-white shadow-sm shadow-pink-100" },
  { icon: GitCompare, title: "Cross-DEX Routing", desc: "Compares routes across OKX DEX (500+ sources) and Uniswap in parallel, always selecting the best price", color: "from-blue-50 to-indigo-50", iconColor: "text-blue-500", iconBg: "bg-white shadow-sm shadow-blue-100" },
  { icon: Zap, title: "x402 Intelligence API", desc: "Sell and buy on-chain intelligence via micropayments. No API keys, no subscriptions — just pay and query", color: "from-violet-50 to-purple-50", iconColor: "text-violet-500", iconBg: "bg-white shadow-sm shadow-violet-100" },
  { icon: Shield, title: "6-Layer Safety Rails", desc: "Trade limits, reserve floors, confidence thresholds, risk scanning, pre-execution simulation, and daily loss circuit breaker", color: "from-emerald-50 to-teal-50", iconColor: "text-emerald-500", iconBg: "bg-white shadow-sm shadow-emerald-100" },
];

const stats = [
  { value: "13/13", label: "OnchainOS Skills" },
  { value: "500+", label: "DEX Sources" },
  { value: "5", label: "x402 Endpoints" },
  { value: "6", label: "Safety Checks" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f7f7fa]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-black/[0.04]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 via-rose-500 to-violet-500 shadow-md shadow-pink-500/15">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <span className="text-[15px] font-bold tracking-tight">Nexus</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://www.oklink.com/x-layer/address/0x9279F67389f5Fa920741B58Ebd13f8eff587687b" target="_blank" rel="noopener noreferrer"
              className="text-[13px] text-muted-foreground hover:text-foreground flex items-center gap-1.5 px-3 py-2">
              <ExternalLink className="h-3.5 w-3.5" /> On-Chain Activity
            </a>
            <a href="https://github.com/Louis-XWB/nexus-agent" target="_blank" rel="noopener noreferrer"
              className="text-[13px] text-muted-foreground hover:text-foreground flex items-center gap-1.5 px-3 py-2">
              <ExternalLink className="h-3.5 w-3.5" /> GitHub
            </a>
            <Link href="/dashboard"
              className="text-[13px] font-semibold text-white bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 px-5 py-2.5 rounded-xl shadow-md shadow-pink-500/15 flex items-center gap-2">
              Launch App <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-[12px] font-semibold text-violet-600 bg-violet-50 px-4 py-2 rounded-full mb-6 border border-violet-100">
            <Zap className="h-3.5 w-3.5" />
            Built on X Layer / Powered by OnchainOS + Uniswap
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            Autonomous DeFi<br />
            <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-violet-500 bg-clip-text text-transparent">Intelligence Agent</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Nexus continuously analyzes markets, executes cross-DEX trades, manages DeFi positions, and sells premium intelligence via x402 micropayments — fully autonomous, fully transparent.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/dashboard"
              className="text-[15px] font-semibold text-white bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 px-8 py-3.5 rounded-2xl shadow-lg shadow-pink-500/20 flex items-center gap-2">
              Launch App <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="https://www.oklink.com/x-layer/address/0x3050BFe3a2fa1b4a8f47b1948DA7A0cB573e4B32" target="_blank" rel="noopener noreferrer"
              className="text-[15px] font-semibold text-foreground bg-white hover:bg-[#f0f0f5] px-8 py-3.5 rounded-2xl shadow-lg shadow-black/[0.04] border border-black/[0.06] flex items-center gap-2">
              View Contract <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="card-elevated text-center py-6 px-4">
              <p className="text-3xl font-bold tracking-tight">{s.value}</p>
              <p className="text-[12px] text-muted-foreground mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-4">How Nexus Works</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-lg mx-auto">Every 30 minutes, Nexus runs a complete analysis-decision-execution cycle</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map((f) => (
              <div key={f.title} className={`card-colored bg-gradient-to-br ${f.color} p-7`}>
                <div className={`${f.iconBg} h-12 w-12 rounded-2xl flex items-center justify-center mb-5`}>
                  <f.icon className={`h-6 w-6 ${f.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Economic Loop */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="card-elevated p-8 md:p-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight mb-3">Self-Sustaining Economic Loop</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Nexus earns, pays, and reinvests autonomously</p>
            <div className="grid grid-cols-3 gap-6">
              <div className="card-colored bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-2xl">
                <p className="text-2xl font-bold text-emerald-600 mb-1">Earn</p>
                <p className="text-[12px] text-muted-foreground">x402 API sales, DeFi yield, trading profits</p>
              </div>
              <div className="card-colored bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-2xl">
                <p className="text-2xl font-bold text-amber-600 mb-1">Pay</p>
                <p className="text-[12px] text-muted-foreground">Reinvest capital, purchase external data</p>
              </div>
              <div className="card-colored bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl">
                <p className="text-2xl font-bold text-blue-600 mb-1">Grow</p>
                <p className="text-[12px] text-muted-foreground">Better data, better decisions, more earnings</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* On-Chain Proof */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold tracking-tight mb-3">Verified On-Chain</h2>
          <p className="text-muted-foreground mb-8">All agent activity is recorded on X Layer — fully transparent and auditable</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://www.oklink.com/x-layer/address/0x3050BFe3a2fa1b4a8f47b1948DA7A0cB573e4B32" target="_blank" rel="noopener noreferrer"
              className="card-elevated px-6 py-4 flex items-center gap-3 hover:shadow-lg transition-shadow group cursor-pointer">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center">
                <Shield className="h-5 w-5 text-pink-500" />
              </div>
              <div className="text-left">
                <p className="text-[13px] font-semibold">NexusRegistry Contract</p>
                <p className="text-[11px] text-muted-foreground font-mono">0x3050...4B32</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground ml-2" />
            </a>
            <a href="https://www.oklink.com/x-layer/address/0x9279F67389f5Fa920741B58Ebd13f8eff587687b" target="_blank" rel="noopener noreferrer"
              className="card-elevated px-6 py-4 flex items-center gap-3 hover:shadow-lg transition-shadow group cursor-pointer">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 flex items-center justify-center">
                <Bot className="h-5 w-5 text-violet-500" />
              </div>
              <div className="text-left">
                <p className="text-[13px] font-semibold">Agent Wallet</p>
                <p className="text-[11px] text-muted-foreground font-mono">0x9279...687b</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card-colored bg-gradient-to-br from-pink-50 via-rose-50 to-violet-50 p-10 md:p-14 rounded-3xl">
            <h2 className="text-3xl font-bold tracking-tight mb-3">Ready to explore?</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">Chat with Nexus, explore the intelligence market, and watch the agent trade in real-time</p>
            <Link href="/dashboard"
              className="inline-flex text-[15px] font-semibold text-white bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 px-8 py-3.5 rounded-2xl shadow-lg shadow-pink-500/20 items-center gap-2">
              Launch App <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/[0.04] py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-[12px] text-muted-foreground">
          <span>Nexus Agent / Build X Hackathon Season 2</span>
          <div className="flex items-center gap-4">
            <a href="https://github.com/Louis-XWB/nexus-agent" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">GitHub</a>
            <a href="https://www.oklink.com/x-layer/address/0x3050BFe3a2fa1b4a8f47b1948DA7A0cB573e4B32" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">X Layer Explorer</a>
            <a href="https://www.x402.org" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">x402 Protocol</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
