
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const metricVariants = cva(
  "glass-panel p-6 flex flex-col space-y-2 transition-all duration-300 animate-fade-in-up",
  {
    variants: {
      intent: {
        default: "",
        primary: "border-l-4 border-l-primary",
        success: "border-l-4 border-l-green-500",
        warning: "border-l-4 border-l-yellow-500",
        danger: "border-l-4 border-l-red-500",
      },
      size: {
        default: "",
        sm: "p-4",
        lg: "p-8",
      },
    },
    defaultVariants: {
      intent: "default",
      size: "default",
    },
  }
);

export interface MetricProps extends VariantProps<typeof metricVariants> {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  className?: string;
  decimal?: boolean;
  prefix?: string;
  suffix?: string;
}

const DashboardMetric = ({
  title,
  value,
  change,
  icon,
  className,
  intent,
  size,
  decimal = false,
  prefix = "",
  suffix = "",
}: MetricProps) => {
  return (
    <div className={cn(metricVariants({ intent, size }), className)}>
      <div className="flex justify-between items-start">
        <h3 className="metric-label">{title}</h3>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="flex items-baseline">
        <span className="metric-value">
          {prefix}
          {decimal && typeof value === "number"
            ? value.toFixed(2)
            : value}
          {suffix}
        </span>
        
        {change !== undefined && (
          <span 
            className={cn(
              "ml-2 text-sm font-medium",
              change > 0 
                ? "text-green-600" 
                : change < 0 
                ? "text-red-600" 
                : "text-gray-500"
            )}
          >
            {change > 0 && "+"}
            {change}%
          </span>
        )}
      </div>
    </div>
  );
};

export default DashboardMetric;
