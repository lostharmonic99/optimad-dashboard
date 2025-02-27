
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardMetric from "@/components/DashboardMetric";
import PerformanceChart from "@/components/PerformanceChart";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  DollarSign, 
  MousePointer, 
  Eye, 
  TrendingUp, 
  BarChart3, 
  AlertTriangle,
  Loader2,
  PauseCircle,
  PlayCircle,
  Trash2
} from "lucide-react";
import { useEffect, useState } from "react";
import campaignService from "@/services/campaignService";
import { toast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Daily performance data - would come from API in real implementation
const dailyPerformance = [
  { date: "Jun 1", spend: 120, impressions: 5200, clicks: 130, cpc: 0.92, conversions: 18 },
  { date: "Jun 2", spend: 132, impressions: 5800, clicks: 145, cpc: 0.91, conversions: 21 },
  { date: "Jun 3", spend: 101, impressions: 4900, clicks: 120, cpc: 0.84, conversions: 15 },
  { date: "Jun 4", spend: 134, impressions: 6100, clicks: 150, cpc: 0.89, conversions: 24 },
  { date: "Jun 5", spend: 158, impressions: 7200, clicks: 170, cpc: 0.93, conversions: 27 },
  { date: "Jun 6", spend: 160, impressions: 7300, clicks: 173, cpc: 0.92, conversions: 28 },
  { date: "Jun 7", spend: 165, impressions: 7400, clicks: 180, cpc: 0.92, conversions: 30 },
  { date: "Jun 8", spend: 175, impressions: 7600, clicks: 192, cpc: 0.91, conversions: 32 },
];

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);
        const data = await campaignService.getCampaign(id);
        setCampaign(data);
      } catch (error) {
        console.error("Error fetching campaign:", error);
        toast({
          title: "Error",
          description: "Failed to load campaign details. Please try again later.",
          variant: "destructive",
        });
        
        // Use mock data for demonstration
        setCampaign({
          id: id,
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
          cpc: 0.36,
          ctr: 7.5,
          conversions: 267,
          conversionRate: 7.8,
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCampaign();
    }
  }, [id]);

  const handleStatusChange = async (status) => {
    try {
      setUpdating(true);
      const method = status === 'active' ? campaignService.launchCampaign : campaignService.pauseCampaign;
      const updatedCampaign = await method(id);
      setCampaign(updatedCampaign);
      
      toast({
        title: `Campaign ${status === 'active' ? 'Activated' : 'Paused'}`,
        description: `The campaign has been ${status === 'active' ? 'activated' : 'paused'} successfully.`,
      });
    } catch (error) {
      console.error("Error updating campaign status:", error);
      toast({
        title: "Error",
        description: "Failed to update campaign status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      setUpdating(true);
      await campaignService.deleteCampaign(id);
      
      toast({
        title: "Campaign Deleted",
        description: "The campaign has been deleted successfully.",
      });
      
      navigate("/");
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast({
        title: "Error",
        description: "Failed to delete campaign. Please try again.",
        variant: "destructive",
      });
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading campaign details...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="page-container">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
          <p className="text-muted-foreground">Campaign ID: {id}</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant={campaign.status === "active" ? "outline" : "default"}
            disabled={updating}
            onClick={() => handleStatusChange(campaign.status === "active" ? "paused" : "active")}
          >
            {updating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : campaign.status === "active" ? (
              <PauseCircle className="h-4 w-4 mr-2" />
            ) : (
              <PlayCircle className="h-4 w-4 mr-2" />
            )}
            {campaign.status === "active" ? "Pause Campaign" : "Resume Campaign"}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate(`/edit-campaign/${id}`)}
          >
            Edit Campaign
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the campaign
                  and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  {updating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in-up">
        <DashboardMetric
          title="Total Spend"
          value={campaign.spend}
          icon={<DollarSign className="h-5 w-5" />}
          intent="primary"
          prefix="$"
          decimal
        />
        <DashboardMetric
          title="Clicks"
          value={campaign.clicks}
          icon={<MousePointer className="h-5 w-5" />}
          intent="success"
        />
        <DashboardMetric
          title="Impressions"
          value={campaign.impressions}
          icon={<Eye className="h-5 w-5" />}
          intent="default"
        />
        <DashboardMetric
          title="CPC"
          value={campaign.cpc}
          icon={<BarChart3 className="h-5 w-5" />}
          intent="default"
          prefix="$"
          decimal
        />
      </div>
      
      <Tabs defaultValue="performance" className="mb-8 animate-fade-in">
        <TabsList className="mb-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="creative">Ad Creative</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="space-y-6">
          <div className="glass-panel p-6">
            <h3 className="font-medium mb-6">Performance Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">CTR</p>
                <p className="text-2xl font-semibold">{campaign.ctr}%</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +0.5% vs. previous period
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-semibold">{campaign.conversionRate}%</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +1.2% vs. previous period
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Conversions</p>
                <p className="text-2xl font-semibold">{campaign.conversions}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +18 vs. previous period
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Budget Used</p>
                <p className="text-2xl font-semibold">{((campaign.spend / campaign.budget) * 100).toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  ${campaign.spend.toFixed(2)} of ${campaign.budget}
                </p>
              </div>
            </div>
          </div>
          
          <PerformanceChart 
            data={dailyPerformance}
            metrics={[
              { key: "clicks", name: "Clicks", color: "#10b981" },
              { key: "conversions", name: "Conversions", color: "#6366f1" },
            ]}
          />
          
          <PerformanceChart 
            data={dailyPerformance}
            type="bar"
            metrics={[
              { key: "spend", name: "Spend ($)", color: "#3b82f6" },
              { key: "cpc", name: "CPC ($)", color: "#f59e0b" },
            ]}
          />
          
          <Alert className="bg-blue-50 border-blue-200">
            <AlertTriangle className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Optimization Tip</AlertTitle>
            <AlertDescription className="text-blue-700">
              This campaign is performing well! Consider increasing your budget or extending the end date to capitalize on its success.
            </AlertDescription>
          </Alert>
        </TabsContent>
        
        <TabsContent value="audience">
          <div className="glass-panel p-6">
            <h3 className="font-medium mb-6">Audience Insights</h3>
            <p className="text-muted-foreground">This section would display demographic data, interests, and other audience insights.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="creative">
          <div className="glass-panel p-6">
            <h3 className="font-medium mb-6">Ad Creative</h3>
            <p className="text-muted-foreground">This section would display all ad creatives for this campaign.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="glass-panel p-6">
            <h3 className="font-medium mb-6">Campaign Settings</h3>
            <p className="text-muted-foreground">This section would display and allow editing of campaign settings.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignDetails;
