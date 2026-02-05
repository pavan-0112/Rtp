import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, Home, Check, X, Clock, Trash2, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface TenantApplication {
  id: string;
  tenant_id: string;
  property_id: string;
  status: string;
  message?: string;
  created_at: string;
  properties: {
    title: string;
    address: string;
    rent: number;
  };
}

interface Property {
  id: string;
  title: string;
  address: string;
  rent: number;
  tenant_id: string;
  status: string;
}

interface TenantProfile {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
}

const Tenants = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<TenantApplication[]>([]);
  const [occupiedProperties, setOccupiedProperties] = useState<Property[]>([]);
  const [tenantProfiles, setTenantProfiles] = useState<Record<string, TenantProfile>>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    if (!user || user.role !== 'landlord') return;

    try {
      // Fetch applications
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('tenant_applications')
        .select(`
          *,
          properties!inner(title, address, rent, landlord_id)
        `)
        .eq('properties.landlord_id', user.id)
        .order('created_at', { ascending: false });

      if (applicationsError) throw applicationsError;
      setApplications(applicationsData || []);

      // Fetch occupied properties
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .eq('landlord_id', user.id)
        .eq('status', 'occupied')
        .not('tenant_id', 'is', null);

      if (propertiesError) throw propertiesError;
      setOccupiedProperties(propertiesData || []);

      // Fetch tenant profiles for occupied properties
      if (propertiesData && propertiesData.length > 0) {
        const tenantIds = propertiesData.map(p => p.tenant_id).filter(Boolean);
        if (tenantIds.length > 0) {
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .in('id', tenantIds);

          if (profilesError) throw profilesError;
          
          const profilesMap = (profilesData || []).reduce((acc, profile) => {
            acc[profile.id] = profile;
            return acc;
          }, {} as Record<string, TenantProfile>);
          
          setTenantProfiles(profilesMap);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load tenant data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const updateApplicationStatus = async (applicationId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('tenant_applications')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', applicationId);

      if (error) throw error;

      // If approved, assign the tenant to the property and update property status
      if (status === 'approved') {
        const application = applications.find(app => app.id === applicationId);
        if (application) {
          // Update property with tenant assignment and status
          const { error: propertyError } = await supabase
            .from('properties')
            .update({ 
              tenant_id: application.tenant_id,
              status: 'occupied',
              updated_at: new Date().toISOString()
            })
            .eq('id', application.property_id);

          if (propertyError) throw propertyError;

          // Create initial rent payment record for the tenant
          const { data: propertyData } = await supabase
            .from('properties')
            .select('rent')
            .eq('id', application.property_id)
            .single();

          if (propertyData?.rent) {
            // Set first payment due to the 1st of next month
            const nextMonth = new Date();
            nextMonth.setMonth(nextMonth.getMonth() + 1, 1);
            nextMonth.setHours(0, 0, 0, 0);

            const { error: rentError } = await supabase
              .from('rent_payments')
              .insert({
                tenant_id: application.tenant_id,
                property_id: application.property_id,
                amount: propertyData.rent,
                due_date: nextMonth.toISOString(),
                status: 'pending'
              });

            if (rentError) {
              console.error('Error creating rent payment:', rentError);
              // Don't fail the whole operation if rent payment creation fails
            }
          }
        }
      }

      toast.success(`Application ${status} successfully!`);
      fetchData();
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error(`Failed to ${status} application`);
    }
  };

  const removeTenant = async (propertyId: string) => {
    if (!confirm('Are you sure you want to remove this tenant?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('properties')
        .update({ 
          tenant_id: null,
          status: 'available'
        })
        .eq('id', propertyId);

      if (error) throw error;
      
      toast.success('Tenant removed successfully!');
      fetchData();
    } catch (error) {
      console.error('Error removing tenant:', error);
      toast.error('Failed to remove tenant');
    }
  };

  if (isLoading) {
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
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Tenant Management</h1>
        </div>

        {/* Current Tenants */}
        {occupiedProperties.length > 0 && (
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Current Tenants ({occupiedProperties.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {occupiedProperties.map((property) => {
                  const tenantProfile = tenantProfiles[property.tenant_id];
                  return (
                    <div key={property.id} className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{property.title}</h3>
                          <p className="text-gray-600 text-sm flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {property.address}
                          </p>
                          <p className="text-green-600 font-medium">${property.rent}/month</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            Occupied
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeTenant(property.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Tenant Details */}
                      <div className="border-t pt-4 space-y-3">
                        <h4 className="font-medium text-gray-900 flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          Tenant Information
                        </h4>
                        <div className="grid grid-cols-1 gap-2 text-sm">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="font-medium">Name:</span>
                            <span className="ml-2">{tenantProfile?.name || 'Not provided'}</span>
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="font-medium">Email:</span>
                            <span className="ml-2">{tenantProfile?.email || 'Not provided'}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="font-medium">Phone:</span>
                            <span className="ml-2">{tenantProfile?.phone || 'Not provided'}</span>
                          </div>
                          <div className="flex items-start">
                            <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-400" />
                            <span className="font-medium">Address:</span>
                            <span className="ml-2">{tenantProfile?.address || 'Not provided'}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 pt-2">
                          Tenant ID: {property.tenant_id?.slice(0, 8)}...
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tenant Applications */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Tenant Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {applications.map((application) => (
                <Card key={application.id} className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User className="h-5 w-5 text-blue-600" />
                        <span>Tenant Application</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                        application.status === 'approved' 
                          ? 'bg-green-100 text-green-800'
                          : application.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {application.status === 'approved' && <Check className="h-3 w-3" />}
                        {application.status === 'rejected' && <X className="h-3 w-3" />}
                        {application.status === 'pending' && <Clock className="h-3 w-3" />}
                        <span className="capitalize">{application.status}</span>
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Home className="h-4 w-4" />
                      <div>
                        <span className="text-sm font-medium">{application.properties.title}</span>
                        <p className="text-xs text-gray-500">{application.properties.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span className="text-sm">Rent: ${application.properties.rent}/month</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Applied: {new Date(application.created_at).toLocaleDateString()}
                    </div>
                    {application.message && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                        <strong>Message:</strong> {application.message}
                      </div>
                    )}
                    
                    {application.status === 'pending' && (
                      <div className="flex space-x-2 pt-2">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() => updateApplicationStatus(application.id, 'approved')}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                          onClick={() => updateApplicationStatus(application.id, 'rejected')}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {applications.length === 0 && (
              <div className="text-center py-12">
                <User className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tenant applications</h3>
                <p className="text-gray-600">Applications will appear here when tenants apply for your properties.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Tenants;
