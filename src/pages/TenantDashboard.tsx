
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Building } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import AICustomerSupport from '../components/AICustomerSupport';
import { ProfileEdit } from '../components/ProfileEdit';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import TenantStats from '../components/tenant/TenantStats';
import TenantQuickActions from '../components/tenant/TenantQuickActions';
import CurrentRentals from '../components/tenant/CurrentRentals';
import RecentApplications from '../components/tenant/RecentApplications';
import RecentMaintenanceRequests from '../components/tenant/RecentMaintenanceRequests';
import { useCurrentRentals } from '../hooks/useCurrentRentals';

const TenantDashboard = () => {
  const { user } = useAuth();
  const { currentRentals, refetch: refetchRentals } = useCurrentRentals();
  const [applications, setApplications] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);

  const fetchApplications = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('tenant_applications')
        .select(`
          *,
          properties(title, address, rent)
        `)
        .eq('tenant_id', user?.id)
        .in('status', ['pending', 'rejected']);

      if (error) throw error;
      console.log('Applications data:', data);
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const fetchMaintenanceRequests = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select(`
          *,
          properties(title, address)
        `)
        .eq('tenant_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMaintenanceRequests(data || []);
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchApplications();
      fetchMaintenanceRequests();
    }
  }, [user]);

  // Set up real-time listeners for all relevant data changes
  useEffect(() => {
    if (!user) return;

    // Listen for rent payment changes
    const rentPaymentsChannel = supabase
      .channel('rent-payments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rent_payments',
          filter: `tenant_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Rent payment changed:', payload);
          // This will trigger re-render for pay rent section
        }
      )
      .subscribe();

    // Listen for maintenance request changes
    const maintenanceChannel = supabase
      .channel('maintenance-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'maintenance_requests',
          filter: `tenant_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Maintenance request changed:', payload);
          fetchMaintenanceRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(rentPaymentsChannel);
      supabase.removeChannel(maintenanceChannel);
    };
  }, [user]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Tenant Dashboard</h1>
          <div className="flex space-x-2">
            <Button asChild>
              <Link to="/properties">
                <Building className="h-4 w-4 mr-2" />
                Browse Properties
              </Link>
            </Button>
          </div>
        </div>

        <TenantStats 
          currentRentalsCount={currentRentals.length}
          pendingApplicationsCount={applications.filter(app => app.status === 'pending').length}
          maintenanceRequestsCount={maintenanceRequests.length}
          activeCommunicationsCount={maintenanceRequests.filter(req => req.status !== 'completed').length}
        />

        <TenantQuickActions />

        <ProfileEdit />

        <CurrentRentals currentRentals={currentRentals} />

        <RecentApplications applications={applications} />

        <RecentMaintenanceRequests maintenanceRequests={maintenanceRequests} />

        <AICustomerSupport />
      </div>
    </DashboardLayout>
  );
};

export default TenantDashboard;
