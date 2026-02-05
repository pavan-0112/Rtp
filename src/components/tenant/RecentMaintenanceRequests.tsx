
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface MaintenanceRequest {
  id: string;
  title: string;
  status: string;
  properties?: {
    title: string;
  };
}

interface RecentMaintenanceRequestsProps {
  maintenanceRequests: MaintenanceRequest[];
}

const RecentMaintenanceRequests = ({ maintenanceRequests }: RecentMaintenanceRequestsProps) => {
  if (maintenanceRequests.length === 0) {
    return null;
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Recent Maintenance Requests</span>
          <Button asChild variant="outline" size="sm">
            <Link to="/maintenance">
              <MessageCircle className="h-4 w-4 mr-2" />
              View All & Chat
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {maintenanceRequests.slice(0, 3).map((request) => (
            <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{request.title}</p>
                <p className="text-sm text-gray-600">
                  {request.properties?.title || 'General Request'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  request.status === 'completed' 
                    ? 'bg-green-100 text-green-800'
                    : request.status === 'in-progress'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {request.status}
                </span>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/maintenance">
                    <MessageCircle className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentMaintenanceRequests;
