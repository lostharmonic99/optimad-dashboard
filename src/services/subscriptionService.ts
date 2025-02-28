
import api from './api';

export interface Subscription {
  id: number;
  name: string;
  price: number;
  duration_days: number;
  features: string[];
  max_campaigns: number;
  is_active: boolean;
}

export interface UserSubscription {
  status: string;
  endDate: string | null;
  plan: Subscription | null;
}

const subscriptionService = {
  getSubscriptions: async (): Promise<Subscription[]> => {
    try {
      const response = await api.get('/subscriptions');
      return response.data;
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      throw error;
    }
  },
  
  getUserSubscription: async (): Promise<UserSubscription> => {
    try {
      const response = await api.get('/subscriptions/my-subscription');
      return response.data;
    } catch (error) {
      console.error('Error fetching user subscription:', error);
      throw error;
    }
  },
  
  subscribe: async (subscriptionId: number, paymentMethodId: string): Promise<UserSubscription> => {
    try {
      const response = await api.post('/subscriptions/subscribe', {
        subscriptionId,
        paymentMethodId
      });
      return response.data.subscription;
    } catch (error) {
      console.error('Error subscribing:', error);
      throw error;
    }
  },
  
  cancelSubscription: async (): Promise<UserSubscription> => {
    try {
      const response = await api.post('/subscriptions/cancel');
      return response.data.subscription;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }
};

export default subscriptionService;
