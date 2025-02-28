
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

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total_count: number;
    total_pages: number;
    current_page: number;
    per_page: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface CampaignFilters {
  status?: string;
  platform?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
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
  getCampaigns: async (filters: CampaignFilters = {}): Promise<PaginatedResponse<Campaign>> => {
    try {
      // Build query params
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.platform) params.append('platform', filters.platform);
      if (filters.page) params.append('page', String(filters.page));
      if (filters.per_page) params.append('per_page', String(filters.per_page));
      if (filters.sort_by) params.append('sort_by', filters.sort_by);
      if (filters.sort_dir) params.append('sort_dir', filters.sort_dir);
      
      const response = await api.get(`/campaigns?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  },
  
  getCampaign: async (id: string): Promise<Campaign> => {
    try {
      const response = await api.get(`/campaigns/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching campaign ${id}:`, error);
      throw error;
    }
  },
  
  createCampaign: async (data: CampaignFormValues): Promise<Campaign> => {
    try {
      const formattedData = formatCampaignData(data);
      const response = await api.post('/campaigns', formattedData);
      return response.data;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  },
  
  updateCampaign: async (id: string, data: CampaignFormValues): Promise<Campaign> => {
    try {
      const formattedData = formatCampaignData(data);
      const response = await api.put(`/campaigns/${id}`, formattedData);
      return response.data;
    } catch (error) {
      console.error(`Error updating campaign ${id}:`, error);
      throw error;
    }
  },
  
  deleteCampaign: async (id: string): Promise<void> => {
    try {
      await api.delete(`/campaigns/${id}`);
    } catch (error) {
      console.error(`Error deleting campaign ${id}:`, error);
      throw error;
    }
  },
  
  // Additional methods for campaign actions
  launchCampaign: async (id: string): Promise<Campaign> => {
    try {
      const response = await api.put(`/campaigns/${id}`, { status: 'active' });
      return response.data;
    } catch (error) {
      console.error(`Error launching campaign ${id}:`, error);
      throw error;
    }
  },
  
  pauseCampaign: async (id: string): Promise<Campaign> => {
    try {
      const response = await api.put(`/campaigns/${id}`, { status: 'paused' });
      return response.data;
    } catch (error) {
      console.error(`Error pausing campaign ${id}:`, error);
      throw error;
    }
  }
};

export default campaignService;
