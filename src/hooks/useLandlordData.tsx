
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';

export const useLandlordData = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [approvedTenants, setApprovedTenants] = useState([]);
  const [applications, setApplications] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);

  useEffect(() => {
    if (user && user.role === 'landlord') {
      fetchProperties();
      fetchApprovedTenants();
      fetchApplications();
      fetchMaintenanceRequests();
    }
  }, [user]);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('landlord_id', user?.id);

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const fetchApprovedTenants = async () => {
    try {
      // Fetch properties that have tenants assigned (occupied status)
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          profiles!properties_tenant_id_fkey(name, email, phone)
        `)
        .eq('landlord_id', user?.id)
        .eq('status', 'occupied')
        .not('tenant_id', 'is', null);

      if (error) throw error;
      console.log('Approved tenants (occupied properties):', data);
      setApprovedTenants(data || []);
    } catch (error) {
      console.error('Error fetching approved tenants:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('tenant_applications')
        .select(`
          *,
          properties!inner(landlord_id),
          profiles!tenant_applications_tenant_id_fkey(name, email, phone)
        `)
        .eq('properties.landlord_id', user?.id)
        .eq('status', 'pending');

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const fetchMaintenanceRequests = async () => {
    try {
      // Get maintenance requests for all landlord's properties
      const { data: landlordProperties } = await supabase
        .from('properties')
        .select('id')
        .eq('landlord_id', user?.id);

      if (landlordProperties && landlordProperties.length > 0) {
        const propertyIds = landlordProperties.map(p => p.id);
        
        const { data, error } = await supabase
          .from('maintenance_requests')
          .select(`
            *,
            properties(title, address),
            profiles!maintenance_requests_tenant_id_fkey(name, email, phone)
          `)
          .in('property_id', propertyIds)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setMaintenanceRequests(data || []);
      }
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
    }
  };

  return {
    properties,
    approvedTenants,
    applications,
    maintenanceRequests
  };
};
