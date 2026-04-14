"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, MessageSquare, Zap, History, Bot, Circle } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/chat", label: "Chat", icon: MessageSquare },
  { href: "/dashboard/intel", label: "Intelligence", icon: Zap },
  { href: "/dashboard/history", label: "History", icon: History },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[240px] bg-white border-r border-black/[0.04]">
      {/* Logo area - taller, more breathing room */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-violet-500 shadow-lg shadow-pink-500/20">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-[16px] font-bold tracking-tight block leading-tight">Nexus</span>
            <span className="text-[11px] text-muted-foreground">Autonomous DeFi Agent</span>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
          AI-powered trading, intelligence, and portfolio management on X Layer.
        </p>
      </div>

      <div className="mx-5 h-px bg-black/[0.05]" />

      {/* Nav - pushed down with more spacing */}
      <nav className="px-3 mt-6 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-[14px] tracking-[-0.01em] transition-all",
                isActive
                  ? "bg-[#f0f0f5] text-foreground font-semibold"
                  : "text-foreground/40 font-normal hover:text-foreground/70 hover:bg-[#fafafc]"
              )}>
              <item.icon className={cn("h-[18px] w-[18px]", isActive ? "text-foreground/70" : "text-foreground/25")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-4 left-3 right-3">
        <div className="card-colored bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50/50 px-4 py-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
            <div className="relative">
              <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500" />
              <Circle className="absolute inset-0 h-2 w-2 fill-emerald-500 text-emerald-500 animate-ping opacity-30" />
            </div>
            Agent Running
          </div>
          <p className="text-[11px] text-emerald-600/50 mt-1 font-mono">X Layer / Chain 196</p>
        </div>
      </div>
    </aside>
  );
}
