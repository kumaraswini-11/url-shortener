import { LucideIcon } from "lucide-react";

interface StatBadgeProps {
  icon: LucideIcon;
  label: string;
  value: string;
  subtext: string;
}

export function StatBadge({
  icon: Icon,
  label,
  value,
  subtext,
}: StatBadgeProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-muted/70">
      <div className="p-2 rounded-md bg-primary/10">
        <Icon className="size-4 text-primary" />
      </div>
      <div>
        <div className="text-xs font-medium text-muted-foreground uppercase">
          {label}
        </div>
        <div className="text-lg font-bold">{value}</div>
        <div className="text-xs text-muted-foreground">{subtext}</div>
      </div>
    </div>
  );
}
