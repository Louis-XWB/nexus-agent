"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, MessageSquare, Zap, History, Bot } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/intel", label: "Intelligence", icon: Zap },
  { href: "/history", label: "History", icon: History },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-[hsl(224_71%_3%)] flex flex-col"
      style={{ background: "linear-gradient(180deg, hsl(224 71% 3.5%) 0%, hsl(224 71% 3%) 100%)" }}>

      {/* Logo area */}
      <div className="flex h-[68px] items-center gap-3 border-b border-border px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-blue-500/20">
          <Bot className="h-5 w-5 text-blue-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold leading-none bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Nexus
          </span>
          <span className="text-[10px] font-medium text-muted-foreground/60 mt-0.5 leading-none tracking-widest uppercase">
            AI Agent
          </span>
        </div>
        <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 tracking-wide">
          BETA
        </span>
      </div>

      {/* Nav */}
      <nav className="space-y-0.5 p-3 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary/8 text-primary"
                  : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
              )}>
              {/* Active left-border accent */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-blue-400 to-purple-500" />
              )}
              <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground/70")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom status card */}
      <div className="p-3 border-t border-border">
        <div className="rounded-lg border border-border bg-white/[0.02] p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="font-medium text-green-400/90">Agent Active</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground/60">
            <span>X Layer</span>
            <span className="font-mono">Chain 196</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
