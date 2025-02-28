import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button, Input, Select } from '@/components/ui';
import { toast } from '@/components/ui/use-toast';
import { createAdmin, assignRole, overrideSubscription } from '@/services/adminService';

const SuperuserDashboard = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('admin');
  const [subscriptionId, setSubscriptionId] = useState('');

  const handleCreateAdmin = async () => {
    try {
      await createAdmin({ email, password, firstName, lastName });
      toast({ title: 'Admin created successfully' });
    } catch (error) {
      toast({ title: 'Error creating admin', variant: 'destructive' });
    }
  };

  const handleAssignRole = async () => {
    try {
      await assignRole({ userId, role });
      toast({ title: 'Role assigned successfully' });
    } catch (error) {
      toast({ title: 'Error assigning role', variant: 'destructive' });
    }
  };

  const handleOverrideSubscription = async () => {
    try {
      await overrideSubscription({ userId, subscriptionId });
      toast({ title: 'Subscription overridden successfully' });
    } catch (error) {
      toast({ title: 'Error overriding subscription', variant: 'destructive' });
    }
  };

  if (user?.role !== 'superuser') {
    return <div>Access denied</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Superuser Dashboard</h1>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Create Admin</h2>
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Input placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <Input placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <Button onClick={handleCreateAdmin}>Create Admin</Button>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Assign Role</h2>
        <Input placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
        <Select value={role} onValueChange={setRole}>
          <Select.Trigger>
            <Select.Value placeholder="Select role" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="admin">Admin</Select.Item>
            <Select.Item value="user">User</Select.Item>
          </Select.Content>
        </Select>
        <Button onClick={handleAssignRole}>Assign Role</Button>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Override Subscription</h2>
        <Input placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
        <Input placeholder="Subscription ID" value={subscriptionId} onChange={(e) => setSubscriptionId(e.target.value)} />
        <Button onClick={handleOverrideSubscription}>Override Subscription</Button>
      </div>
    </div>
  );
};

export default SuperuserDashboard;