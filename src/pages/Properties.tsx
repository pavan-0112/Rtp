
import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import AddPropertyForm from '../components/AddPropertyForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, MapPin, DollarSign, User, Trash2, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface Property {
  id: string;
  property_id: string;
  title: string;
  address: string;
  rent: number;
  status: string;
  description?: string;
  landlord_id?: string;
  tenant_id?: string;
}

const Properties = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);

  const fetchProperties = async () => {
    try {
      let query = supabase.from('properties').select('*');
      
      // Landlords see all their properties, tenants see available properties
      if (user?.role === 'landlord') {
        query = query.eq('landlord_id', user.id);
      } else {
        query = query.eq('status', 'available');
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApplications = async () => {
    if (user?.role !== 'tenant') return;
    
    try {
      const { data, error } = await supabase
        .from('tenant_applications')
        .select('*')
        .eq('tenant_id', user.id);

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  useEffect(() => {
    fetchProperties();
    fetchApplications();
  }, [user]);

  const handlePropertyAdded = () => {
    fetchProperties();
    setShowAddForm(false);
  };

  const applyForProperty = async (propertyId: string) => {
    if (!user || user.role !== 'tenant') return;

    try {
      const { error } = await supabase
        .from('tenant_applications')
        .insert({
          tenant_id: user.id,
          property_id: propertyId,
          status: 'pending'
        });

      if (error) throw error;
      
      toast.success('Application submitted successfully!');
      fetchApplications();
    } catch (error: any) {
      console.error('Error applying for property:', error);
      if (error.code === '23505') {
        toast.error('You have already applied for this property');
      } else {
        toast.error('Failed to submit application');
      }
    }
  };

  const removeTenant = async (propertyId: string) => {
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
      fetchProperties();
    } catch (error) {
      console.error('Error removing tenant:', error);
      toast.error('Failed to remove tenant');
    }
  };

  const deleteProperty = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) throw error;
      
      toast.success('Property deleted successfully!');
      fetchProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Failed to delete property');
    }
  };

  const hasApplied = (propertyId: string) => {
    return applications.some(app => app.property_id === propertyId);
  };

  const copyPropertyId = (propertyId: string) => {
    navigator.clipboard.writeText(propertyId);
    toast.success('Property ID copied to clipboard!');
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
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.role === 'landlord' ? 'My Properties' : 'Available Properties'}
          </h1>
          {user?.role === 'landlord' && (
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              {showAddForm ? 'Cancel' : 'Add New Property'}
            </Button>
          )}
        </div>

        {showAddForm && user?.role === 'landlord' && (
          <AddPropertyForm onPropertyAdded={handlePropertyAdded} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    <span>{property.title}</span>
                  </div>
                  {user?.role === 'landlord' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteProperty(property.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Property ID Display */}
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <div>
                      <span className="text-xs text-gray-600">Property ID</span>
                      <p className="text-sm font-mono font-semibold text-blue-800">{property.property_id}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyPropertyId(property.property_id)}
                    className="text-xs"
                  >
                    Copy
                  </Button>
                </div>

                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{property.address}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm font-semibold">${property.rent}/month</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    property.status === 'available' 
                      ? 'bg-green-100 text-green-800'
                      : property.status === 'occupied'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {property.status}
                  </span>
                </div>
                {property.description && (
                  <p className="text-xs text-gray-600 mt-2">{property.description}</p>
                )}
                
                {user?.role === 'tenant' && property.status === 'available' && (
                  <div className="pt-2 space-y-2">
                    <div className="text-xs text-blue-600 p-2 bg-blue-50 rounded">
                      💡 Tip: Use the Property ID above to verify this property's legitimacy in the Property Verification section
                    </div>
                    {hasApplied(property.id) ? (
                      <Button variant="outline" className="w-full" disabled>
                        Application Submitted
                      </Button>
                    ) : (
                      <Button 
                        className="w-full" 
                        onClick={() => applyForProperty(property.id)}
                      >
                        Apply to Rent
                      </Button>
                    )}
                  </div>
                )}
                
                {user?.role === 'landlord' && (
                  <div className="space-y-2 pt-2">
                    {property.tenant_id && (
                      <Button 
                        variant="outline" 
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeTenant(property.id)}
                      >
                        Remove Tenant
                      </Button>
                    )}
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {properties.length === 0 && (
          <div className="text-center py-12">
            <Building className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {user?.role === 'landlord' ? 'No properties found' : 'No available properties'}
            </h3>
            <p className="text-gray-600">
              {user?.role === 'landlord' 
                ? 'Start by adding your first property.' 
                : 'Check back later for new listings.'}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Properties;
