import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { MaintenanceRequestForm } from '../components/maintenance/MaintenanceRequestForm';
import { MaintenanceRequestsList } from '../components/maintenance/MaintenanceRequestsList';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import DemoMaintenanceRequest from '../components/tenant/DemoMaintenanceRequest';

interface Property {
  id: string;
  title: string;
  address: string;
  landlord_id: string | null;
  tenant_id: string | null;
  landlord?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}

const Maintenance = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProperties();
      fetchMaintenanceRequests();
    }
  }, [user]);

  const fetchProperties = async () => {
    try {
      if (user?.role === 'tenant') {
        // For tenants, get properties they are currently renting AND approved applications
        const [occupiedProperties, approvedApplications] = await Promise.all([
          supabase
            .from('properties')
            .select('id, title, address, landlord_id, tenant_id')
            .eq('tenant_id', user.id)
            .eq('status', 'occupied'),
          
          supabase
            .from('tenant_applications')
            .select(`
              properties!inner(id, title, address, landlord_id, tenant_id)
            `)
            .eq('tenant_id', user.id)
            .eq('status', 'approved')
        ]);

        if (occupiedProperties.error) throw occupiedProperties.error;
        if (approvedApplications.error) throw approvedApplications.error;

        // Combine both occupied and approved properties
        const allProperties = [
          ...(occupiedProperties.data || []),
          ...(approvedApplications.data || []).map(app => app.properties)
        ];

        // Remove duplicates based on property id
        const uniqueProperties = allProperties.filter((property, index, self) => 
          index === self.findIndex(p => p.id === property.id)
        );

        // Get unique landlord IDs
        const landlordIds = new Set<string>();
        uniqueProperties.forEach(property => {
          if (property.landlord_id) {
            landlordIds.add(property.landlord_id);
          }
        });

        // Fetch landlord profiles
        const { data: landlordsData, error: landlordsError } = await supabase
          .from('profiles')
          .select('id, name, email, phone, address')
          .in('id', Array.from(landlordIds));

        if (landlordsError) throw landlordsError;

        // Create landlord map
        const landlordsMap = new Map();
        if (landlordsData) {
          landlordsData.forEach(landlord => {
            landlordsMap.set(landlord.id, {
              id: landlord.id,
              name: landlord.name || 'Not provided',
              email: landlord.email || 'Not provided',
              phone: landlord.phone || 'Not provided',
              address: landlord.address || 'Not provided'
            });
          });
        }

        // Add landlord information to properties
        const propertiesWithLandlords = uniqueProperties.map(property => ({
          ...property,
          landlord: property.landlord_id ? landlordsMap.get(property.landlord_id) : undefined
        }));

        setProperties(propertiesWithLandlords);
      } else {
        // For landlords, get all their properties
        const { data, error } = await supabase
          .from('properties')
          .select('id, title, address, landlord_id, tenant_id')
          .eq('landlord_id', user.id);

        if (error) throw error;
        setProperties(data || []);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const fetchMaintenanceRequests = async () => {
    try {
      let query = supabase
        .from('maintenance_requests')
        .select(`
          *,
          properties(title, address, landlord_id)
        `)
        .order('created_at', { ascending: false });

      if (user?.role === 'tenant') {
        query = query.eq('tenant_id', user.id);
      } else {
        // For landlords, get requests for their properties
        query = query.in('property_id', properties.map(p => p.id));
      }

      const { data, error } = await query;

      if (error) throw error;

      // If tenant, fetch landlord information for each request
      if (user?.role === 'tenant' && data) {
        const landlordIds = new Set<string>();
        data.forEach(request => {
          if (request.properties?.landlord_id) {
            landlordIds.add(request.properties.landlord_id);
          }
        });

        if (landlordIds.size > 0) {
          const { data: landlordsData, error: landlordsError } = await supabase
            .from('profiles')
            .select('id, name, email, phone, address')
            .in('id', Array.from(landlordIds));

          if (!landlordsError && landlordsData) {
            const landlordsMap = new Map();
            landlordsData.forEach(landlord => {
              landlordsMap.set(landlord.id, {
                id: landlord.id,
                name: landlord.name || 'Not provided',
                email: landlord.email || 'Not provided',
                phone: landlord.phone || 'Not provided',
                address: landlord.address || 'Not provided'
              });
            });

            // Add landlord info to maintenance requests
            const requestsWithLandlords = data.map(request => ({
              ...request,
              properties: {
                ...request.properties,
                landlord: request.properties?.landlord_id ? landlordsMap.get(request.properties.landlord_id) : undefined
              }
            }));

            setMaintenanceRequests(requestsWithLandlords);
            return;
          }
        }
      }

      setMaintenanceRequests(data || []);
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSubmitted = () => {
    fetchMaintenanceRequests();
  };

  const handleChatOpen = (requestId: string) => {
    // Placeholder for chat functionality
    console.log('Opening chat for request:', requestId);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Maintenance</h1>
        
        {user?.role === 'tenant' && (
          <MaintenanceRequestForm 
            properties={properties} 
            onRequestSubmitted={handleRequestSubmitted}
          />
        )}
        
        <MaintenanceRequestsList 
          requests={maintenanceRequests}
          onChatOpen={handleChatOpen}
          onRequestsRefresh={handleRequestSubmitted}
        />

        {/* Add demo section when no requests exist */}
        {maintenanceRequests.length === 0 && user?.role === 'tenant' && (
          <div className="space-y-6 border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-800">Demo Maintenance Request (Sample Data)</h2>
            <p className="text-gray-600">
              This is how your maintenance requests will appear once submitted and processed by your landlord.
            </p>
            <DemoMaintenanceRequest />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Maintenance;
