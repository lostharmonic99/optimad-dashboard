
import { 
  DollarSign, 
  MousePointer, 
  Eye, 
  BarChart, 
  TrendingUp,
  TrendingDown,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardMetric from "@/components/DashboardMetric";
import CampaignCard from "@/components/CampaignCard";
import PerformanceChart from "@/components/PerformanceChart";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import campaignService from "@/services/campaignService";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSpend: 0,
    totalClicks: 0,
    totalImpressions: 0,
    averageCpc: 0,
    changePercentage: 0
  });
  
  // Sample performance data - in a real implementation this would come from the API
  const performanceData = [
    { date: "Jan 1", spend: 120, impressions: 5200, clicks: 130, cpc: 0.92 },
    { date: "Jan 2", spend: 132, impressions: 5800, clicks: 145, cpc: 0.91 },
    { date: "Jan 3", spend: 101, impressions: 4900, clicks: 120, cpc: 0.84 },
    { date: "Jan 4", spend: 134, impressions: 6100, clicks: 150, cpc: 0.89 },
    { date: "Jan 5", spend: 158, impressions: 7200, clicks: 170, cpc: 0.93 },
    { date: "Jan 6", spend: 160, impressions: 7300, clicks: 173, cpc: 0.92 },
    { date: "Jan 7", spend: 165, impressions: 7400, clicks: 180, cpc: 0.92 },
  ];

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const data = await campaignService.getCampaigns();
        setCampaigns(data);
        
        // Calculate stats from campaigns
        if (data.length > 0) {
          const spend = data.reduce((sum, campaign) => sum + campaign.budget, 0);
          const clicks = data.reduce((sum, campaign) => sum + (campaign.clicks || 0), 0);
          const impressions = data.reduce((sum, campaign) => sum + (campaign.impressions || 0), 0);
          const cpc = clicks > 0 ? spend / clicks : 0;
          
          setStats({
            totalSpend: spend,
            totalClicks: clicks,
            totalImpressions: impressions,
            averageCpc: cpc,
            changePercentage: 5.8 // Mock change percentage
          });
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        toast({
          title: "Error",
          description: "Failed to load campaign data. Please try again later.",
          variant: "destructive",
        });
        
        // Use mock data for demonstration
        setCampaigns([
          {
            id: "1",
            name: "Summer Collection Launch",
            status: "active",
            platform: "both",
            spend: 1245.67,
            budget: 5000,
            startDate: "2023-06-01",
            endDate: "2023-07-15",
            objective: "Conversions",
            impressions: 45678,
            clicks: 3421,
          },
          {
            id: "2",
            name: "Holiday Special Promotion",
            status: "paused",
            platform: "facebook",
            spend: 879.23,
            budget: 2000,
            startDate: "2023-05-15",
            endDate: "2023-06-30",
            objective: "Traffic",
            impressions: 28765,
            clicks: 1987,
          },
          {
            id: "3",
            name: "New Product Awareness",
            status: "active",
            platform: "instagram",
            spend: 567.89,
            budget: 1500,
            startDate: "2023-06-10",
            objective: "Brand Awareness",
            impressions: 12345,
            clicks: 876,
          },
        ]);
        
        setStats({
          totalSpend: 2692.79,
          totalClicks: 6284,
          totalImpressions: 86788,
          averageCpc: 0.42,
          changePercentage: 5.8
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild>
          <Link to="/create">Create Campaign</Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" style={{ animationDelay: '0.1s' }}>
        <DashboardMetric
          title="Total Spend"
          value={stats.totalSpend}
          change={stats.changePercentage}
          icon={<DollarSign className="h-5 w-5" />}
          intent="primary"
          prefix="$"
          decimal
        />
        <DashboardMetric
          title="Total Clicks"
          value={stats.totalClicks}
          change={12.4}
          icon={<MousePointer className="h-5 w-5" />}
          intent="success"
        />
        <DashboardMetric
          title="Total Impressions"
          value={stats.totalImpressions}
          change={8.7}
          icon={<Eye className="h-5 w-5" />}
          intent="default"
        />
        <DashboardMetric
          title="Average CPC"
          value={stats.averageCpc}
          change={-1.5}
          icon={<BarChart className="h-5 w-5" />}
          intent={-1.5 < 0 ? "success" : "danger"}
          prefix="$"
          decimal
        />
      </div>
      
      <div className="mb-8" style={{ animationDelay: '0.2s' }}>
        <PerformanceChart 
          data={performanceData}
          metrics={[
            { key: "spend", name: "Spend ($)", color: "#3b82f6" },
            { key: "clicks", name: "Clicks", color: "#10b981" },
          ]}
        />
      </div>
      
      <div className="mb-8" style={{ animationDelay: '0.3s' }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="section-title">Recent Campaigns</h2>
          <Button variant="outline" asChild size="sm">
            <Link to="/analytics">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {campaigns.slice(0, 2).map((campaign) => (
            <CampaignCard key={campaign.id} {...campaign} />
          ))}
        </div>
      </div>
      
      <div style={{ animationDelay: '0.4s' }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="section-title">Optimization Suggestions</h2>
        </div>
        <div className="glass-panel p-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium">Increase budget for "Summer Collection Launch"</h3>
                <p className="text-sm text-muted-foreground">This campaign is performing well with a CTR of 7.5%. Consider increasing the budget to reach more customers.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg">
              <TrendingDown className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-medium">Adjust targeting for "Holiday Special Promotion"</h3>
                <p className="text-sm text-muted-foreground">This campaign has a high CPC of $1.25. Consider refining your audience targeting to improve efficiency.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
