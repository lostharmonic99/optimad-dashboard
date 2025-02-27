
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PerformanceChart from "@/components/PerformanceChart";
import CampaignCard from "@/components/CampaignCard";
import DashboardMetric from "@/components/DashboardMetric";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, FilterX, FilterIcon } from "lucide-react";

// Mock data - in a real app, this would come from an API
const mockCampaigns = [
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
  {
    id: "4",
    name: "Flash Sale Campaign",
    status: "completed",
    platform: "facebook",
    spend: 450.00,
    budget: 450,
    startDate: "2023-05-01",
    endDate: "2023-05-10",
    objective: "Conversions",
    impressions: 18900,
    clicks: 1243,
  },
  {
    id: "5",
    name: "Brand Awareness Push",
    status: "active",
    platform: "instagram",
    spend: 689.45,
    budget: 1200,
    startDate: "2023-06-05",
    objective: "Brand Awareness",
    impressions: 25678,
    clicks: 1524,
  },
] as const;

const performanceData = [
  { date: "Week 1", spend: 520, impressions: 21500, clicks: 630, cpc: 0.82, ctr: 2.93 },
  { date: "Week 2", spend: 580, impressions: 24800, clicks: 745, cpc: 0.78, ctr: 3.00 },
  { date: "Week 3", spend: 610, impressions: 27900, clicks: 820, cpc: 0.74, ctr: 2.94 },
  { date: "Week 4", spend: 634, impressions: 29100, clicks: 850, cpc: 0.75, ctr: 2.92 },
  { date: "Week 5", spend: 658, impressions: 31200, clicks: 920, cpc: 0.72, ctr: 2.95 },
  { date: "Week 6", spend: 690, impressions: 32300, clicks: 973, cpc: 0.71, ctr: 3.01 },
];

const Analytics = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showFilters, setShowFilters] = useState(false);
  
  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? (
              <>
                <FilterX className="h-4 w-4 mr-2" />
                Hide Filters
              </>
            ) : (
              <>
                <FilterIcon className="h-4 w-4 mr-2" />
                Show Filters
              </>
            )}
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                size="sm"
                className={cn(
                  "justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {showFilters && (
        <div className="glass-panel p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Status</label>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Objective</label>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Select objective" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Objectives</SelectItem>
                <SelectItem value="awareness">Brand Awareness</SelectItem>
                <SelectItem value="consideration">Consideration</SelectItem>
                <SelectItem value="conversion">Conversion</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <DashboardMetric
          title="Total Spend"
          value={3832.24}
          prefix="$"
          decimal
        />
        <DashboardMetric
          title="Total Impressions"
          value={131366}
        />
        <DashboardMetric
          title="Total Clicks"
          value={8051}
        />
        <DashboardMetric
          title="Average CTR"
          value={2.95}
          suffix="%"
          decimal
        />
      </div>
      
      <Tabs defaultValue="performance" className="mb-8" style={{ animationDelay: '0.2s' }}>
        <TabsList className="mb-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="space-y-6 animate-fade-in">
          <PerformanceChart 
            data={performanceData}
            metrics={[
              { key: "spend", name: "Spend ($)", color: "#3b82f6" },
              { key: "clicks", name: "Clicks", color: "#10b981" },
            ]}
          />
          
          <PerformanceChart 
            data={performanceData}
            metrics={[
              { key: "cpc", name: "CPC ($)", color: "#f59e0b" },
              { key: "ctr", name: "CTR (%)", color: "#6366f1" },
            ]}
          />
        </TabsContent>
        
        <TabsContent value="campaigns" className="animate-fade-in">
          <div className="grid grid-cols-1 gap-4">
            {mockCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} {...campaign} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="comparison" className="animate-fade-in">
          <div className="glass-panel p-6">
            <h3 className="font-medium mb-4">Campaign Comparison</h3>
            <p className="text-muted-foreground mb-4">Select campaigns to compare their performance side by side.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select first campaign" />
                </SelectTrigger>
                <SelectContent>
                  {mockCampaigns.map((campaign) => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select second campaign" />
                </SelectTrigger>
                <SelectContent>
                  {mockCampaigns.map((campaign) => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button>Compare Campaigns</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
