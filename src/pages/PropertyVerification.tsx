import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Search } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface VerificationResult {
  propertyId: string;
  address: string;
  status: 'verified' | 'not_found';
  title: string;
  rent: number;
  description: string;
  landlord: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  lastUpdated: string;
}

interface LandlordProfile {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

const PropertyVerification = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  const handleVerification = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a property ID');
      return;
    }

    setIsLoading(true);
    
    try {
      // First get the property
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('property_id', searchQuery.trim())
        .single();

      if (propertyError || !propertyData) {
        setVerificationResult({
          propertyId: searchQuery.trim(),
          address: 'Not found',
          status: 'not_found',
          title: 'Property not found',
          rent: 0,
          description: 'No property found with this ID',
          landlord: {
            name: 'Not available',
            email: 'Not available',
            phone: 'Not available',
            address: 'Not available'
          },
          lastUpdated: new Date().toLocaleDateString()
        });
        toast.error('Property not found');
        return;
      }

      // Then get the landlord profile if landlord_id exists
      let landlordProfile: LandlordProfile | null = null;
      if (propertyData.landlord_id) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('name, email, phone, address')
          .eq('id', propertyData.landlord_id)
          .single();

        if (!profileError && profileData) {
          landlordProfile = profileData;
        }
      }

      setVerificationResult({
        propertyId: propertyData.property_id,
        address: propertyData.address,
        status: 'verified',
        title: propertyData.title,
        rent: propertyData.rent || 0,
        description: propertyData.description || 'No description available',
        landlord: {
          name: landlordProfile?.name || 'Not provided',
          email: landlordProfile?.email || 'Not provided',
          phone: landlordProfile?.phone || 'Not provided',
          address: landlordProfile?.address || 'Not provided'
        },
        lastUpdated: propertyData.updated_at ? new Date(propertyData.updated_at).toLocaleDateString() : new Date().toLocaleDateString()
      });
      toast.success('Property verified successfully');
    } catch (error) {
      console.error('Error verifying property:', error);
      toast.error('Failed to verify property');
      setVerificationResult({
        propertyId: searchQuery.trim(),
        address: 'Error occurred',
        status: 'not_found',
        title: 'Verification failed',
        rent: 0,
        description: 'An error occurred while verifying the property',
        landlord: {
          name: 'Not available',
          email: 'Not available',
          phone: 'Not available',
          address: 'Not available'
        },
        lastUpdated: new Date().toLocaleDateString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-100';
      case 'not_found':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'not_found':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Property Verification</h1>
          <p className="text-gray-600 mt-2">
            Verify property ownership by entering the property ID to view landlord details
          </p>
        </div>

        {/* Search Section */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Verify Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search">Property ID</Label>
              <Input
                id="search"
                placeholder="Enter property ID (e.g., PROP-12345678)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Button onClick={handleVerification} disabled={isLoading} className="w-full">
              {isLoading ? (
                'Verifying...'
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Verify Property
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        {verificationResult && (
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {getStatusIcon(verificationResult.status)}
                <span>Verification Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Property ID</Label>
                  <p className="text-lg font-semibold">{verificationResult.propertyId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(verificationResult.status)}`}>
                      {verificationResult.status === 'verified' ? 'Verified' : 'Not Found'}
                    </span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Property Title</Label>
                  <p className="text-lg font-semibold">{verificationResult.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Address</Label>
                  <p className="text-lg font-semibold">{verificationResult.address}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Monthly Rent</Label>
                  <p className="text-lg font-semibold">${verificationResult.rent}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Last Updated</Label>
                  <p className="text-lg font-semibold">{verificationResult.lastUpdated}</p>
                </div>
              </div>

              {verificationResult.status === 'verified' && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-3">Landlord Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Name</Label>
                      <p className="text-lg font-semibold">{verificationResult.landlord.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Email</Label>
                      <p className="text-lg font-semibold">{verificationResult.landlord.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Phone</Label>
                      <p className="text-lg font-semibold">{verificationResult.landlord.phone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Address</Label>
                      <p className="text-lg font-semibold">{verificationResult.landlord.address}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <Label className="text-sm font-medium text-gray-600">Description</Label>
                <p className="text-sm text-gray-700 mt-1">{verificationResult.description}</p>
              </div>

              {/* Status-specific information */}
              <div className="mt-6 p-4 rounded-lg border">
                {verificationResult.status === 'verified' && (
                  <div className="text-green-700">
                    <h4 className="font-semibold mb-2">✅ Property Verified</h4>
                    <p>This property has been verified and belongs to the landlord listed above. You can contact them directly for rental inquiries.</p>
                  </div>
                )}
                {verificationResult.status === 'not_found' && (
                  <div className="text-red-700">
                    <h4 className="font-semibold mb-2">❌ Property Not Found</h4>
                    <p>No property was found with this ID. Please check the property ID and try again, or contact the property owner to verify the correct ID.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Information Section */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>How to Use Property Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <p>• Enter the property ID provided by the landlord to verify ownership details.</p>
              <p>• Verified properties will show complete landlord contact information.</p>
              <p>• Use this feature before applying for rentals to ensure legitimacy.</p>
              <p>• Property IDs are automatically generated when landlords create listings.</p>
              <p>• Contact the landlord directly using the verified contact details for inquiries.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PropertyVerification;
