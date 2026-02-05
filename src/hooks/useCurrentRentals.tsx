
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';

interface Property {
  id: string;
  title: string;
  address: string;
  rent: number;
  type: 'occupied' | 'approved';
  application_date?: string;
  landlord?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}

export const useCurrentRentals = () => {
  const { user } = useAuth();
  const [currentRentals, setCurrentRentals] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCurrentRentals = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch occupied properties
      const { data: occupiedPropertiesData, error: occupiedError } = await supabase
        .from('properties')
        .select(`
          id,
          title,
          address,
          rent,
          landlord_id,
          created_at
        `)
        .eq('tenant_id', user?.id)
        .eq('status', 'occupied');

      if (occupiedError) throw occupiedError;

      // Fetch approved applications with property details
      const { data: approvedApplicationsData, error: approvedError } = await supabase
        .from('tenant_applications')
        .select(`
          id,
          created_at,
          property_id,
          properties!inner(
            id,
            title,
            address,
            rent,
            landlord_id
          )
        `)
        .eq('tenant_id', user?.id)
        .eq('status', 'approved');

      if (approvedError) throw approvedError;

      // Get unique landlord IDs from both datasets
      const landlordIds = new Set<string>();
      
      if (occupiedPropertiesData) {
        occupiedPropertiesData.forEach(property => {
          if (property.landlord_id) {
            landlordIds.add(property.landlord_id);
          }
        });
      }

      if (approvedApplicationsData) {
        approvedApplicationsData.forEach(application => {
          if (application.properties?.landlord_id) {
            landlordIds.add(application.properties.landlord_id);
          }
        });
      }

      // Fetch complete landlord profiles
      const { data: landlordsData, error: landlordsError } = await supabase
        .from('profiles')
        .select('id, name, email, phone, address')
        .in('id', Array.from(landlordIds));

      if (landlordsError) throw landlordsError;

      // Create a map of complete landlord data
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

      // Process occupied properties with complete landlord data
      const occupiedRentals: Property[] = (occupiedPropertiesData || []).map(property => ({
        id: property.id,
        title: property.title || 'Property Title',
        address: property.address || 'Address not specified',
        rent: property.rent || 0,
        type: 'occupied' as const,
        landlord: property.landlord_id ? landlordsMap.get(property.landlord_id) : undefined
      }));

      // Process approved applications with complete landlord data
      const approvedRentals: Property[] = (approvedApplicationsData || []).map(application => ({
        id: application.properties?.id || application.property_id,
        title: application.properties?.title || 'Property Title',
        address: application.properties?.address || 'Address not specified',
        rent: application.properties?.rent || 0,
        type: 'approved' as const,
        application_date: application.created_at,
        landlord: application.properties?.landlord_id ? landlordsMap.get(application.properties.landlord_id) : undefined
      }));

      const allRentals = [...occupiedRentals, ...approvedRentals];
      console.log('Current rentals with complete landlord data:', allRentals);
      setCurrentRentals(allRentals);
    } catch (error) {
      console.error('Error fetching current rentals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentRentals();
  }, [user]);

  // Set up real-time listener for tenant applications and properties
  useEffect(() => {
    if (!user) return;

    const applicationsChannel = supabase
      .channel('tenant-applications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tenant_applications',
          filter: `tenant_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Application status changed:', payload);
          fetchCurrentRentals();
        }
      )
      .subscribe();

    const propertiesChannel = supabase
      .channel('properties-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'properties',
          filter: `tenant_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Property status changed:', payload);
          fetchCurrentRentals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(applicationsChannel);
      supabase.removeChannel(propertiesChannel);
    };
  }, [user]);

  return { currentRentals, loading, refetch: fetchCurrentRentals };
};
