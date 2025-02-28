
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

export interface PaymentConfig {
  stripe: {
    publishableKey: string;
  };
  paypal: {
    clientId: string;
    mode: string;
  };
  mpesa: {
    enabled: boolean;
    env: string;
  };
}

const subscriptionService = {
  getSubscriptions: async (): Promise<Subscription[]> => {
    try {
      const response = await api.get('/subscriptions');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching subscriptions:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch subscription plans');
    }
  },

  getUserSubscription: async (): Promise<UserSubscription> => {
    try {
      const response = await api.get('/subscriptions/my-subscription');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching user subscription:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch your subscription details');
    }
  },

  getPaymentConfig: async (): Promise<PaymentConfig> => {
    try {
      const response = await api.get('/subscriptions/payment-config');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching payment config:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch payment configuration');
    }
  },

  // Stripe payment
  subscribeWithStripe: async (subscriptionId: number, paymentMethodId: string): Promise<any> => {
    try {
      const response = await api.post('/subscriptions/subscribe/stripe', {
        subscriptionId,
        paymentMethodId
      });
      return response.data;
    } catch (error: any) {
      console.error('Error creating Stripe subscription:', error);
      throw new Error(error.response?.data?.error || 'Failed to create subscription with Stripe');
    }
  },

  // PayPal payment
  subscribeWithPaypal: async (subscriptionId: number): Promise<any> => {
    try {
      const response = await api.post('/subscriptions/subscribe/paypal', {
        subscriptionId
      });
      return response.data;
    } catch (error: any) {
      console.error('Error creating PayPal subscription:', error);
      throw new Error(error.response?.data?.error || 'Failed to create subscription with PayPal');
    }
  },

  // MPESA payment
  subscribeWithMpesa: async (subscriptionId: number, phoneNumber: string): Promise<any> => {
    try {
      const response = await api.post('/subscriptions/subscribe/mpesa', {
        subscriptionId,
        phoneNumber
      });
      return response.data;
    } catch (error: any) {
      console.error('Error creating MPESA subscription:', error);
      throw new Error(error.response?.data?.error || 'Failed to create subscription with MPESA');
    }
  },

  // Confirm payment after processing
  confirmPayment: async (subscriptionId: number, paymentId: string, paymentMethod: string, payerId?: string): Promise<UserSubscription> => {
    try {
      const response = await api.post('/subscriptions/confirm-payment', {
        subscriptionId,
        paymentId,
        paymentMethod,
        payerId // Required for PayPal
      });
      return response.data.subscription;
    } catch (error: any) {
      console.error('Error confirming payment:', error);
      throw new Error(error.response?.data?.error || 'Failed to confirm payment');
    }
  },

  cancelSubscription: async (): Promise<UserSubscription> => {
    try {
      const response = await api.post('/subscriptions/cancel');
      return response.data.subscription;
    } catch (error: any) {
      console.error('Error canceling subscription:', error);
      throw new Error(error.response?.data?.error || 'Failed to cancel subscription');
    }
  }
};

export default subscriptionService;
