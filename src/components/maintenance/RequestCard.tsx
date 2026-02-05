
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Clock, AlertTriangle, MessageCircle, Home } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { AnimatedDiv, fadeInUp } from '@/components/ui/animated-components';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';

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

interface RequestCardProps {
  request: MaintenanceRequest;
  onChatOpen: (requestId: string) => void;
  onStatusUpdate: (requestId: string, status: string) => void;
}

export const RequestCard = ({ request, onChatOpen, onStatusUpdate }: RequestCardProps) => {
  const { user } = useAuth();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'plumbing': return '🔧';
      case 'electrical': return '⚡';
      case 'hvac': return '🌡️';
      case 'appliances': return '🔌';
      default: return '📋';
    }
  };

  return (
    <AnimatedDiv 
      className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-200 hover:bg-blue-50/30"
      {...fadeInUp}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">{getCategoryIcon(request.category)}</span>
            <h3 className="font-semibold text-lg text-gray-800">{request.title}</h3>
          </div>
          <p className="text-gray-600 text-sm mb-3 leading-relaxed">{request.description}</p>
          
          {request.properties && (
            <div className="flex items-center space-x-2 mb-2">
              <Home className="h-4 w-4 text-gray-500" />
              <p className="text-gray-500 text-sm font-medium">
                {request.properties.title} - {request.properties.address}
              </p>
            </div>
          )}
          
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <span className="flex items-center space-x-1">
              <span>Category:</span>
              <span className="font-medium capitalize">{request.category}</span>
            </span>
            <span>•</span>
            <span>
              Submitted {new Date(request.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-3 ml-4">
          <StatusBadge status={request.status} />
          <PriorityBadge priority={request.priority} />
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onChatOpen(request.id)}
          className="flex items-center space-x-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
        >
          <MessageCircle className="h-4 w-4" />
          <span>Open Chat</span>
        </Button>
        
        {user?.role === 'landlord' && (
          <Select onValueChange={(value) => onStatusUpdate(request.id, value)}>
            <SelectTrigger className="w-40 h-8">
              <SelectValue placeholder="Update Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-3 w-3 text-orange-500" />
                  <span>Pending</span>
                </div>
              </SelectItem>
              <SelectItem value="in-progress">
                <div className="flex items-center space-x-2">
                  <Clock className="h-3 w-3 text-blue-500" />
                  <span>In Progress</span>
                </div>
              </SelectItem>
              <SelectItem value="completed">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Completed</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
    </AnimatedDiv>
  );
};
