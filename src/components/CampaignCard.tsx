
import { ArrowRight, Facebook, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export interface CampaignCardProps {
  id: string;
  name: string;
  status: "active" | "paused" | "completed" | "draft";
  platform: "facebook" | "instagram" | "both";
  spend: number;
  budget: number;
  startDate: string;
  endDate?: string;
  objective: string;
  impressions: number;
  clicks: number;
}

const CampaignCard = ({
  id,
  name,
  status,
  platform,
  spend,
  budget,
  startDate,
  endDate,
  objective,
  impressions,
  clicks,
}: CampaignCardProps) => {
  const statusColors = {
    active: "bg-green-100 text-green-800",
    paused: "bg-yellow-100 text-yellow-800",
    completed: "bg-gray-100 text-gray-800",
    draft: "bg-blue-100 text-blue-800",
  };

  const ctr = clicks > 0 && impressions > 0 
    ? ((clicks / impressions) * 100).toFixed(2) 
    : "0.00";

  const budgetPercentage = (spend / budget) * 100;

  return (
    <div className="glass-panel overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h3 className="font-medium text-lg truncate">{name}</h3>
            <Badge className={statusColors[status]}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            {(platform === "facebook" || platform === "both") && (
              <Facebook className="h-4 w-4 text-optimad-600" />
            )}
            {(platform === "instagram" || platform === "both") && (
              <Instagram className="h-4 w-4 text-optimad-600" />
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-xs text-muted-foreground">Objective</p>
            <p className="font-medium">{objective}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Dates</p>
            <p className="font-medium">
              {new Date(startDate).toLocaleDateString()} 
              {endDate && ` - ${new Date(endDate).toLocaleDateString()}`}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Budget</p>
            <p className="font-medium">${budget.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Spend</p>
            <p className="font-medium">${spend.toLocaleString()}</p>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
          <div 
            className="bg-primary h-1.5 rounded-full" 
            style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-xs text-muted-foreground">Impressions</p>
            <p className="font-medium">{impressions.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Clicks</p>
            <p className="font-medium">{clicks.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">CTR</p>
            <p className="font-medium">{ctr}%</p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            variant="ghost" 
            size="sm"
            className="flex items-center gap-1 text-primary"
            asChild
          >
            <Link to={`/campaign/${id}`}>
              View details
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
