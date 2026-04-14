"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, MessageSquare, Zap, History, Bot, Circle } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/intel", label: "Intelligence", icon: Zap },
  { href: "/history", label: "History", icon: History },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[240px] bg-white border-r border-black/[0.04]">
      <div className="flex h-16 items-center gap-3 px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-violet-500 shadow-lg shadow-pink-500/20">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div>
          <span className="text-[15px] font-bold tracking-tight block leading-tight">Nexus</span>
          <span className="text-[10px] text-muted-foreground font-medium">DeFi Agent</span>
        </div>
      </div>

      <div className="mx-5 h-px bg-black/[0.04]" />

      <nav className="px-3 mt-5 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] tracking-[-0.01em] transition-all",
                isActive
                  ? "bg-foreground text-white font-medium shadow-md shadow-black/10"
                  : "text-foreground/50 font-normal hover:text-foreground/80 hover:bg-black/[0.02]"
              )}>
              <item.icon className={cn("h-[18px] w-[18px]", isActive ? "text-white/80" : "text-foreground/30")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-4 left-3 right-3">
        <div className="card-colored bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50/50 px-4 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
              <div className="relative">
                <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500" />
                <Circle className="absolute inset-0 h-2 w-2 fill-emerald-500 text-emerald-500 animate-ping opacity-30" />
              </div>
              Agent Running
            </div>
          </div>
          <p className="text-[11px] text-emerald-600/50 mt-1 font-mono">X Layer / Chain 196</p>
        </div>
      </div>
    </aside>
  );
}
