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
      <div className="flex h-16 items-center gap-3 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 via-rose-500 to-violet-500 shadow-lg shadow-pink-500/20">
          <Bot className="h-4 w-4 text-white" />
        </div>
        <span className="text-base font-bold tracking-tight">Nexus</span>
      </div>

      <nav className="px-3 mt-1 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all",
                isActive
                  ? "bg-[#f7f7fa] text-foreground font-semibold shadow-sm shadow-black/[0.03]"
                  : "text-muted-foreground hover:text-foreground hover:bg-[#f7f7fa]"
              )}>
              <item.icon className={cn("h-[18px] w-[18px]", isActive && "text-pink-500")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="card-colored bg-gradient-to-br from-emerald-50 to-teal-50/80 px-4 py-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500" />
            Agent Running
          </div>
          <p className="text-[11px] text-emerald-600/60 mt-0.5 font-mono">X Layer / Chain 196</p>
        </div>
      </div>
    </aside>
  );
}
