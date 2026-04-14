"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, MessageSquare, Zap, History, Bot, Activity, Hexagon } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/intel", label: "Intelligence", icon: Zap },
  { href: "/history", label: "History", icon: History },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[260px] glass-strong border-r border-white/[0.06]">
      {/* Logo */}
      <div className="flex h-[72px] items-center gap-3 border-b border-white/[0.06] px-6">
        <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 shadow-lg shadow-blue-500/25">
          <Bot className="h-5 w-5 text-white" />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 opacity-40 blur-lg" />
        </div>
        <div>
          <span className="text-xl font-bold text-gradient tracking-tight">Nexus</span>
          <p className="text-[10px] text-slate-500 -mt-0.5 font-medium tracking-wide uppercase">Autonomous DeFi Agent</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 p-3 mt-3">
        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-2">Navigation</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all relative overflow-hidden",
                isActive
                  ? "bg-gradient-to-r from-blue-500/20 via-purple-500/15 to-blue-500/10 text-white shadow-lg shadow-blue-500/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              )}>
              {isActive && (
                <>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-gradient-to-b from-blue-400 to-purple-500 shadow-lg shadow-blue-400/50" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent pointer-events-none" />
                </>
              )}
              <item.icon className={cn(
                "h-[18px] w-[18px] transition-all",
                isActive ? "text-blue-400 drop-shadow-[0_0_6px_rgba(59,130,246,0.5)]" : "group-hover:text-slate-300"
              )} />
              <span className="relative z-10">{item.label}</span>
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Separator */}
      <div className="mx-5 my-3 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Agent Status */}
      <div className="absolute bottom-4 left-3 right-3">
        <div className="relative rounded-xl overflow-hidden">
          {/* Animated gradient border */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20 animate-glow-pulse" />
          <div className="relative m-[1px] rounded-[11px] bg-[#0c1221]/90 backdrop-blur-xl p-3.5">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <div className="relative">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                  <div className="absolute inset-0 h-2 w-2 rounded-full bg-emerald-400 animate-ping opacity-30" />
                </div>
                Agent Running
              </div>
              <Activity className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">X Layer</span>
              <span className="font-mono text-slate-500 bg-white/[0.04] px-1.5 py-0.5 rounded">Chain 196</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
