import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  variant?: "default" | "success";
}

export const StatsCard = ({ title, value, icon: Icon, trend, variant = "default" }: StatsCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            variant === "success" ? "bg-success/10" : "bg-primary/10"
          )}>
            <Icon className={cn(
              "w-5 h-5",
              variant === "success" ? "text-success" : "text-primary"
            )} />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {trend && (
            <p className="text-xs text-muted-foreground">{trend}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
