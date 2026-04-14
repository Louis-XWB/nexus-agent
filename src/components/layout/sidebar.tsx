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
    <aside className="fixed left-0 top-0 z-40 h-screen w-[240px] border-r border-border bg-white">
      <div className="flex h-14 items-center gap-2.5 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-violet-500">
          <Bot className="h-4 w-4 text-white" />
        </div>
        <span className="text-[15px] font-semibold text-foreground">Nexus</span>
      </div>

      <nav className="px-3 mt-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium mb-0.5",
                isActive
                  ? "bg-secondary text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              )}>
              <item.icon className="h-[18px] w-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-4 left-3 right-3">
        <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 px-3.5 py-3">
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-700">
            <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500" />
            Agent Running
          </div>
          <p className="text-[11px] text-emerald-600/70 mt-0.5 font-mono">X Layer / Chain 196</p>
        </div>
      </div>
    </aside>
  );
}
