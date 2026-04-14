import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string; value: string; change?: string;
  changeType?: "positive" | "negative" | "neutral"; subtitle?: string; icon: LucideIcon;
}

const iconColors: Record<string, { bg: string; icon: string }> = {
  default: { bg: "bg-blue-500/10 border-blue-500/15", icon: "text-blue-400" },
  positive: { bg: "bg-green-500/10 border-green-500/15", icon: "text-green-400" },
  negative: { bg: "bg-red-500/10 border-red-500/15", icon: "text-red-400" },
  neutral: { bg: "bg-muted/60 border-border", icon: "text-muted-foreground" },
};

export function StatCard({ title, value, change, changeType = "neutral", subtitle, icon: Icon }: StatCardProps) {
  const colors = changeType === "positive"
    ? iconColors.positive
    : changeType === "negative"
    ? iconColors.negative
    : iconColors.default;

  return (
    <Card className="bg-card border-border card-glow group hover:border-border/80 relative overflow-hidden">
      {/* Subtle top-edge gradient accent */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border", colors.bg)}>
            <Icon className={cn("h-4 w-4", colors.icon)} />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold font-mono tracking-tight">{value}</p>
          <div className="flex items-center gap-2 mt-1.5">
            {change && (
              <span className={cn(
                "inline-flex items-center text-xs font-semibold font-mono px-1.5 py-0.5 rounded",
                changeType === "positive" && "text-green-400 bg-green-500/10",
                changeType === "negative" && "text-red-400 bg-red-500/10",
                changeType === "neutral" && "text-muted-foreground bg-muted/50"
              )}>{change}</span>
            )}
            {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
