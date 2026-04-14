import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string; value: string; change?: string;
  changeType?: "positive" | "negative" | "neutral"; subtitle?: string; icon: LucideIcon;
}

export function StatCard({ title, value, change, changeType = "neutral", subtitle, icon: Icon }: StatCardProps) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="mt-2">
          <p className="text-2xl font-bold font-mono">{value}</p>
          <div className="flex items-center gap-2 mt-1">
            {change && <span className={cn("text-xs font-medium font-mono",
              changeType === "positive" && "text-green-400", changeType === "negative" && "text-red-400",
              changeType === "neutral" && "text-muted-foreground")}>{change}</span>}
            {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
