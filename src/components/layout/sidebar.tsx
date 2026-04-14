"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, MessageSquare, Zap, History, Bot, Circle, ChevronRight } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, color: "from-pink-500 to-rose-500", shadow: "shadow-pink-500/25", iconActive: "text-pink-500", bgActive: "bg-pink-50" },
  { href: "/chat", label: "Chat", icon: MessageSquare, color: "from-violet-500 to-purple-500", shadow: "shadow-violet-500/25", iconActive: "text-violet-500", bgActive: "bg-violet-50" },
  { href: "/intel", label: "Intelligence", icon: Zap, color: "from-amber-500 to-orange-500", shadow: "shadow-amber-500/25", iconActive: "text-amber-500", bgActive: "bg-amber-50" },
  { href: "/history", label: "History", icon: History, color: "from-blue-500 to-indigo-500", shadow: "shadow-blue-500/25", iconActive: "text-blue-500", bgActive: "bg-blue-50" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[240px] bg-white border-r border-black/[0.04]">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-violet-500 shadow-lg shadow-pink-500/20">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div>
          <span className="text-[15px] font-bold tracking-tight block leading-tight">Nexus</span>
          <span className="text-[10px] text-muted-foreground font-medium">DeFi Agent</span>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-black/[0.04]" />

      {/* Nav */}
      <nav className="px-3 mt-4 space-y-1">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-2">Menu</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[13px] font-medium transition-all",
                isActive
                  ? `${item.bgActive} font-semibold`
                  : "text-muted-foreground hover:bg-[#f7f7fa]"
              )}>
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-xl transition-all",
                isActive
                  ? `bg-gradient-to-br ${item.color} shadow-md ${item.shadow}`
                  : "bg-[#f0f0f5] group-hover:bg-[#e8e8f0]"
              )}>
                <item.icon className={cn("h-4 w-4", isActive ? "text-white" : "text-muted-foreground")} />
              </div>
              <span className={cn(isActive && "text-foreground")}>{item.label}</span>
              {isActive && <ChevronRight className="h-3.5 w-3.5 ml-auto text-muted-foreground" />}
            </Link>
          );
        })}
      </nav>

      {/* Agent Status */}
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
            <span className="text-[10px] font-mono text-emerald-600/50 bg-white/60 px-1.5 py-0.5 rounded-md">v1.0</span>
          </div>
          <p className="text-[11px] text-emerald-600/50 mt-1 font-mono">X Layer / Chain 196</p>
        </div>
      </div>
    </aside>
  );
}
