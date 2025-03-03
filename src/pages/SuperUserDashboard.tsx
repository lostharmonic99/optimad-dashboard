
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardMetric from '@/components/DashboardMetric';
import PerformanceChart from '@/components/PerformanceChart';
import CampaignCard from '@/components/CampaignCard';
import useAuth from '@/hooks/useAuth';
import { adminService } from '@/services/adminService';
import { Spinner } from '@/components/ui/spinner';

// Define interfaces for metrics
interface MetricProps {
  label: string;
  value: number | string;
}

interface DashboardData {
  totalUsers: number;
  totalCampaigns: number;
  activeSubscriptions: number;
  monthlyRevenue: string;
  recentCampaigns: any[];
  performanceData: {
    data: any[];
    metrics: string[];
  };
}

const SuperUserDashboard = () => {
  const { user, isLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch admin dashboard data
        const stats = await adminService.getStats();
        const campaigns = await adminService.getAllCampaigns();
        
        setDashboardData({
          totalUsers: stats.totalUsers || 0,
          totalCampaigns: stats.totalCampaigns || 0,
          activeSubscriptions: stats.activeSubscriptions || 0,
          monthlyRevenue: stats.monthlyRevenue || '$0',
          recentCampaigns: campaigns.slice(0, 4) || [],
          performanceData: {
            data: stats.performanceData || [],
            metrics: ['Impressions', 'Clicks', 'Conversions']
          }
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        
        // Set mock data for development
        setDashboardData({
          totalUsers: 342,
          totalCampaigns: 87,
          activeSubscriptions: 124,
          monthlyRevenue: '$12,450',
          recentCampaigns: [],
          performanceData: {
            data: [],
            metrics: ['Impressions', 'Clicks', 'Conversions']
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Super User Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardMetric label="Total Users" value={dashboardData?.totalUsers || 0} />
        <DashboardMetric label="Total Campaigns" value={dashboardData?.totalCampaigns || 0} />
        <DashboardMetric label="Active Subscriptions" value={dashboardData?.activeSubscriptions || 0} />
        <DashboardMetric label="Monthly Revenue" value={dashboardData?.monthlyRevenue || '$0'} />
      </div>

      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList>
          <TabsTrigger value="campaigns">Recent Campaigns</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="users">User Growth</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Recent Campaigns</h2>
          {dashboardData?.recentCampaigns?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData.recentCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          ) : (
            <p>No recent campaigns found.</p>
          )}
        </TabsContent>

        <TabsContent value="performance">
          <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <PerformanceChart 
              data={dashboardData?.performanceData?.data || []} 
              metrics={dashboardData?.performanceData?.metrics || []} 
            />
          </div>
        </TabsContent>

        <TabsContent value="users">
          <h2 className="text-xl font-semibold mb-4">User Growth</h2>
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <p>User growth visualization will be shown here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperUserDashboard;
