import api from './api';

export const createAdmin = async (data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) => {
  const response = await api.post('/admin/create-admin', data);
  return response.data;
};

export const assignRole = async (data: { userId: string; role: string }) => {
  const response = await api.post('/admin/assign-role', data);
  return response.data;
};

export const overrideSubscription = async (data: { userId: string; subscriptionId: string }) => {
  const response = await api.post('/subscriptions/override', data);
  return response.data;
};