
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import DashboardLayout from '../components/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import RentPaymentCard from '../components/tenant/RentPaymentCard';
import EmptyRentPaymentsState from '../components/tenant/EmptyRentPaymentsState';
import DemoRentPaymentCard from '../components/tenant/DemoRentPaymentCard';
import SampleDataCard from '../components/tenant/SampleDataCard';

interface RentPayment {
  id: string;
  property_id: string;
  amount: number;
  due_date: string;
  status: string;
  payment_method?: string;
  transaction_id?: string;
  properties: {
    title: string;
    address: string;
    landlord_id: string;
    landlord?: {
      id: string;
      name: string;
      email: string;
      phone: string;
      address: string;
    };
  };
}

const PayRent = () => {
  const { user } = useAuth();
  const [rentPayments, setRentPayments] = useState<RentPayment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRentPayments = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('rent_payments')
        .select(`
          id,
          property_id,
          amount,
          due_date,
          status,
          payment_method,
          transaction_id,
          properties!inner(
            title,
            address,
            landlord_id
          )
        `)
        .eq('tenant_id', user?.id)
        .order('due_date', { ascending: true });

      if (error) throw error;

      // Get unique landlord IDs
      const landlordIds = new Set<string>();
      if (data) {
        data.forEach(payment => {
          if (payment.properties?.landlord_id) {
            landlordIds.add(payment.properties.landlord_id);
          }
        });
      }

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

      // Combine payment data with landlord information
      const paymentsWithLandlords = (data || []).map(payment => ({
        ...payment,
        properties: {
          ...payment.properties,
          landlord: payment.properties?.landlord_id ? landlordsMap.get(payment.properties.landlord_id) : undefined
        }
      }));

      console.log('Rent payments with landlord data:', paymentsWithLandlords);
      setRentPayments(paymentsWithLandlords);
    } catch (error) {
      console.error('Error fetching rent payments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentPayments();
  }, [user]);

  // Set up real-time listener for rent payments
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('rent-payments-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rent_payments',
          filter: `tenant_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Rent payment updated:', payload);
          fetchRentPayments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handlePaymentUpdate = () => {
    fetchRentPayments();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading your rent payments...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Pay Rent</h1>
        </div>

        {rentPayments.length === 0 ? (
          <div className="space-y-6">
            <EmptyRentPaymentsState />
            
            {/* Demo Section */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Demo Rent Payment (Sample Data)</h2>
              <p className="text-gray-600 mb-4">
                This is how your rent payments will appear once you have active rentals.
              </p>
              <DemoRentPaymentCard />
            </div>

            <SampleDataCard
              title="No Rent Payments Due"
              description="Rent payments will appear here once you have approved rental applications and active leases."
              actionText="View My Rentals"
              onAction={() => window.location.href = '/my-rentals'}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {rentPayments.map((payment) => (
              <RentPaymentCard 
                key={payment.id} 
                payment={payment} 
                onPaymentUpdate={handlePaymentUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PayRent;
