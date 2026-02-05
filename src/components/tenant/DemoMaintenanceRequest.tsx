
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  MessageCircle, 
  Calendar, 
  Home, 
  User,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

const DemoMaintenanceRequest = () => {
  const priority = 'high';
  const status = 'in_progress';
  const category = 'plumbing';

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Kitchen Sink Leak
                </h3>
              </div>
              <p className="text-gray-600">
                The kitchen sink has been leaking under the cabinet for the past two days. 
                Water is pooling and may cause damage to the flooring if not addressed soon.
              </p>
            </div>
            <div className="flex flex-col space-y-2 ml-4">
              <Badge variant="outline" className={getPriorityColor(priority)}>
                High Priority
              </Badge>
              <Badge variant="outline" className={getStatusColor(status)}>
                In Progress
              </Badge>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Home className="h-4 w-4 mr-2" />
              Property & Landlord Information
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-2 text-gray-400" />
                <span className="font-medium">Property:</span>
                <span className="ml-2">Modern Downtown Apartment</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-2 text-gray-400" />
                <span className="font-medium">Address:</span>
                <span className="ml-2">123 Main Street, Downtown City</span>
              </div>
              <div className="flex items-center">
                <User className="h-3 w-3 mr-2 text-gray-400" />
                <span className="font-medium">Landlord:</span>
                <span className="ml-2">John Smith</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-3 w-3 mr-2 text-gray-400" />
                <span className="font-medium">Email:</span>
                <span className="ml-2">john.smith@email.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-3 w-3 mr-2 text-gray-400" />
                <span className="font-medium">Phone:</span>
                <span className="ml-2">(555) 123-4567</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Submitted: {new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                <span className="capitalize">{category}</span>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat with Landlord
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemoMaintenanceRequest;
