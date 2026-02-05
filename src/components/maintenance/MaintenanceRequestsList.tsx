
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Home } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { AnimatedDiv, fadeInUp, staggerContainer } from '@/components/ui/animated-components';
import { RequestCard } from './RequestCard';

interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  priority: string;
  category: string;
  status: string;
  created_at: string;
  tenant_id: string;
  property_id: string | null;
  properties?: {
    title: string;
    address: string;
    landlord_id: string;
  };
}

interface MaintenanceRequestsListProps {
  requests: MaintenanceRequest[];
  onChatOpen: (requestId: string) => void;
  onRequestsRefresh: () => void;
}

export const MaintenanceRequestsList = ({ requests, onChatOpen, onRequestsRefresh }: MaintenanceRequestsListProps) => {
  const { user } = useAuth();

  const updateRequestStatus = async (requestId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('maintenance_requests')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', requestId);

      if (error) throw error;
      
      toast.success(`Request status updated to ${status}`, {
        description: 'The tenant will be notified of this change.'
      });
      onRequestsRefresh();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
        <CardTitle className="flex items-center space-x-2">
          <Home className="h-5 w-5 text-gray-600" />
          <span>
            {user?.role === 'tenant' ? 'Your Maintenance Requests' : 'Property Maintenance Requests'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <AnimatedDiv className="space-y-4" {...staggerContainer}>
          {requests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onChatOpen={onChatOpen}
              onStatusUpdate={updateRequestStatus}
            />
          ))}
          
          {requests.length === 0 && (
            <AnimatedDiv 
              className="text-center py-12"
              {...fadeInUp}
            >
              <div className="bg-gray-50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No maintenance requests</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {user?.role === 'tenant' 
                  ? 'Submit your first maintenance request using the form above. We\'ll notify your landlord immediately.' 
                  : 'No maintenance requests have been submitted for your properties yet. Tenants can submit requests through their dashboard.'
                }
              </p>
            </AnimatedDiv>
          )}
        </AnimatedDiv>
      </CardContent>
    </Card>
  );
};
