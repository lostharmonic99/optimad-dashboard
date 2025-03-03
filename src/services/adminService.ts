
import api from './api';

// Function to get dashboard statistics for admin/super users
export const getStats = async () => {
  try {
    const response = await api.get('/admin/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    throw error;
  }
};

// Function to get all users for admin management
export const getUsers = async () => {
  try {
    const response = await api.get('/admin/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Function to get all campaigns across users
export const getAllCampaigns = async () => {
  try {
    const response = await api.get('/admin/campaigns');
    return response.data;
  } catch (error) {
    console.error('Error fetching all campaigns:', error);
    throw error;
  }
};

// Function to get subscription data
export const getSubscriptionData = async () => {
  try {
    const response = await api.get('/admin/subscriptions');
    return response.data;
  } catch (error) {
    console.error('Error fetching subscription data:', error);
    throw error;
  }
};

// Export the admin service functions
const adminService = {
  getStats,
  getUsers,
  getAllCampaigns,
  getSubscriptionData
};

export { adminService };
