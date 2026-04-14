"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, MessageSquare, Zap, History, Bot, Activity } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/intel", label: "Intelligence", icon: Zap },
  { href: "/history", label: "History", icon: History },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[260px] border-r border-border/50 bg-gradient-to-b from-[hsl(222,47%,7%)] to-[hsl(224,50%,4%)]">
      {/* Logo */}
      <div className="flex h-[72px] items-center gap-3 border-b border-border/50 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div>
          <span className="text-lg font-bold text-gradient">Nexus</span>
          <p className="text-[10px] text-muted-foreground -mt-0.5">Autonomous DeFi Agent</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 p-3 mt-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all relative",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}>
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-blue-400 to-purple-500" />
              )}
              <item.icon className={cn("h-[18px] w-[18px]", isActive && "text-blue-400")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Agent Status */}
      <div className="absolute bottom-4 left-3 right-3">
        <div className="rounded-xl border border-border/50 bg-white/[0.02] p-3.5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-medium text-foreground">
              <div className="relative">
                <div className="h-2 w-2 rounded-full bg-green-400" />
                <div className="absolute inset-0 h-2 w-2 rounded-full bg-green-400 animate-ping opacity-40" />
              </div>
              Agent Running
            </div>
            <Activity className="h-3.5 w-3.5 text-green-400" />
          </div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>X Layer</span>
            <span className="font-mono">Chain 196</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
