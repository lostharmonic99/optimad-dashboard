
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CampaignForm from "@/components/CampaignForm";
import campaignService from "@/services/campaignService";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const EditCampaign = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);
        const data = await campaignService.getCampaign(id);
        
        // Transform backend data to form format
        const formattedData = {
          name: data.name,
          objective: data.objective,
          platform: data.platform,
          budgetType: data.budget_type,
          budget: data.budget,
          startDate: new Date(data.start_date),
          endDate: data.end_date ? new Date(data.end_date) : undefined,
          targeting: {
            locations: data.targeting?.locations || ["United States"],
            ageMin: data.targeting?.age_min || 18,
            ageMax: data.targeting?.age_max || 65,
            gender: data.targeting?.gender || "all",
            interests: data.targeting?.interests || [],
          },
          adCreative: {
            headline: data.creative?.headline || "",
            description: data.creative?.description || "",
            primaryText: data.creative?.primary_text || "",
            callToAction: data.creative?.call_to_action || "",
          },
        };
        
        setCampaign(formattedData);
      } catch (error) {
        console.error("Error fetching campaign:", error);
        toast({
          title: "Error",
          description: "Failed to load campaign data. Please try again later.",
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCampaign();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading campaign data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Edit Campaign</h1>
      <CampaignForm initialData={campaign} campaignId={id} />
    </div>
  );
};

export default EditCampaign;
