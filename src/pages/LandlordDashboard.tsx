
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Wrench, User, MapPin, Phone, Mail } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import DashboardStats from '../components/dashboard/DashboardStats';
import QuickActions from '../components/dashboard/QuickActions';
import MyTenants from '../components/dashboard/MyTenants';
import RecentActivity from '../components/dashboard/RecentActivity';
import FinancialDashboard from '../components/dashboard/FinancialDashboard';
import { ProfileEdit } from '../components/ProfileEdit';
import { useLandlordData } from '../hooks/useLandlordData';

const LandlordDashboard = () => {
  const { properties, approvedTenants, applications, maintenanceRequests } = useLandlordData();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Landlord Dashboard</h1>
          <Button asChild>
            <Link to="/properties">Add Property</Link>
          </Button>
        </div>

        <DashboardStats 
          propertiesCount={properties.length}
          tenantsCount={approvedTenants.length}
          applicationsCount={applications.length}
        />

        <QuickActions />

        {/* Financial Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Financial Overview</h2>
          <FinancialDashboard properties={properties} />
        </div>

        {/* Maintenance Requests Section */}
        {maintenanceRequests.length > 0 && (
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Wrench className="h-5 w-5 text-orange-600" />
                  <span>Recent Maintenance Requests ({maintenanceRequests.length})</span>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to="/maintenance">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    View All & Respond
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenanceRequests.slice(0, 5).map((request) => (
                  <div key={request.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{request.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            request.status === 'completed' 
                              ? 'bg-green-100 text-green-800'
                              : request.status === 'in-progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {request.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {request.properties?.title || 'Unknown Property'}
                          </span>
                          <span>Priority: {request.priority}</span>
                          <span>{new Date(request.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2 ml-4">
                        {request.profiles && (
                          <div className="text-right text-sm">
                            <p className="font-medium text-gray-900 flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {request.profiles.name || 'Tenant'}
                            </p>
                            {request.profiles.phone && (
                              <p className="text-gray-600 flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {request.profiles.phone}
                              </p>
                            )}
                            {request.profiles.email && (
                              <p className="text-gray-600 flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {request.profiles.email}
                              </p>
                            )}
                          </div>
                        )}
                        <Button asChild variant="outline" size="sm">
                          <Link to="/maintenance">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Respond
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <MyTenants approvedTenants={approvedTenants} />

        <ProfileEdit />

        <RecentActivity />
      </div>
    </DashboardLayout>
  );
};

export default LandlordDashboard;
