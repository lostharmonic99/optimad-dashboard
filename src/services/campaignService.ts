
import api from './api';
import { CampaignFormValues } from '@/components/CampaignForm';

export interface Campaign {
  id: number;
  name: string;
  objective: string;
  platform: string;
  budget_type: string;
  budget: number;
  start_date: string;
  end_date?: string;
  status: string;
  targeting?: {
    locations: string[];
    age_min: number;
    age_max: number;
    gender: string;
    interests?: string[];
  };
  creative?: {
    headline: string;
    description: string;
    primary_text: string;
    call_to_action: string;
  };
}

// Convert frontend form data to API format
const formatCampaignData = (data: CampaignFormValues) => {
  return {
    name: data.name,
    objective: data.objective,
    platform: data.platform,
    budgetType: data.budgetType,
    budget: data.budget,
    startDate: data.startDate.toISOString(),
    endDate: data.endDate ? data.endDate.toISOString() : null,
    targeting: {
      locations: data.targeting.locations,
      ageMin: data.targeting.ageMin,
      ageMax: data.targeting.ageMax,
      gender: data.targeting.gender,
      interests: data.targeting.interests,
    },
    adCreative: {
      headline: data.adCreative.headline,
      description: data.adCreative.description,
      primaryText: data.adCreative.primaryText,
      callToAction: data.adCreative.callToAction,
    }
  };
};

const campaignService = {
  getCampaigns: async (): Promise<Campaign[]> => {
    const response = await api.get('/campaigns');
    return response.data;
  },
  
  getCampaign: async (id: string): Promise<Campaign> => {
    const response = await api.get(`/campaigns/${id}`);
    return response.data;
  },
  
  createCampaign: async (data: CampaignFormValues): Promise<Campaign> => {
    const formattedData = formatCampaignData(data);
    const response = await api.post('/campaigns', formattedData);
    return response.data;
  },
  
  updateCampaign: async (id: string, data: CampaignFormValues): Promise<Campaign> => {
    const formattedData = formatCampaignData(data);
    const response = await api.put(`/campaigns/${id}`, formattedData);
    return response.data;
  },
  
  deleteCampaign: async (id: string): Promise<void> => {
    await api.delete(`/campaigns/${id}`);
  },
  
  // Additional methods for campaign actions
  launchCampaign: async (id: string): Promise<Campaign> => {
    const response = await api.put(`/campaigns/${id}`, { status: 'active' });
    return response.data;
  },
  
  pauseCampaign: async (id: string): Promise<Campaign> => {
    const response = await api.put(`/campaigns/${id}`, { status: 'paused' });
    return response.data;
  }
};

export default campaignService;
