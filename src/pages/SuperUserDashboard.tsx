import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardMetric from "@/components/DashboardMetric";
import PerformanceChart from "@/components/PerformanceChart";
import { adminService } from "@/services/adminService";

interface SuperUserDashboardProps {
  // Define any props here
}

const SuperUserDashboard: React.FC<SuperUserDashboardProps> = () => {
  const { user, loading, error } = useAuth();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [activeSubscriptions, setActiveSubscriptions] = useState<number>(0);
  const [revenue, setRevenue] = useState<number>(0);

  useEffect(() => {
    if (!loading && user?.role !== 'admin') {
      // Handle unauthorized access
      console.warn("User is not authorized to view this page");
      // Redirect or show an error message
    }
  }, [user, loading]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const campaignsData = await adminService.getAllCampaigns();
        setCampaigns(campaignsData);

        const usersCount = await adminService.getTotalUsers();
        setTotalUsers(usersCount);

        const subscriptionsCount = await adminService.getActiveSubscriptions();
        setActiveSubscriptions(subscriptionsCount);

        const totalRevenue = await adminService.getTotalRevenue();
        setRevenue(totalRevenue);

      } catch (err) {
        console.error("Failed to fetch admin data:", err);
      }
    };

    if (user?.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user || user.role !== 'admin') {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-5">Super User Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardMetric label="Total Campaigns" value={campaigns.length} />
        <DashboardMetric label="Total Users" value={totalUsers} />
        <DashboardMetric label="Active Subscriptions" value={activeSubscriptions} />
        <DashboardMetric label="Total Revenue" value={`$${revenue}`} />
      </div>

      <Tabs defaultvalue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>Overview of recent campaign performance</CardDescription>
            </CardHeader>
            <CardContent>
              <PerformanceChart data={campaigns} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>User Engagement</CardTitle>
              <CardDescription>Metrics on user engagement and activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <p>User Engagement Metrics Here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Analytics</CardTitle>
              <CardDescription>Insights into subscription trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <p>Subscription Analytics Data Here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperUserDashboard;
