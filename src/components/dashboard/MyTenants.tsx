
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, User, Home } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  address: string;
  rent: number;
  tenant_id: string;
  created_at: string;
  updated_at: string;
}

interface MyTenantsProps {
  approvedTenants: Property[];
}

const MyTenants = ({ approvedTenants }: MyTenantsProps) => {
  if (approvedTenants.length === 0) {
    return null;
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-green-600" />
          <span>My Tenants</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {approvedTenants.map((property) => (
            <div key={property.id} className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">{property.title}</h4>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Occupied
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Home className="h-4 w-4 mr-2" />
                  {property.address}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-green-200">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="h-4 w-4 mr-2" />
                    <span>Tenant ID: {property.tenant_id?.slice(0, 8)}...</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">${property.rent}</p>
                    <p className="text-xs text-gray-500">per month</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Property updated: {new Date(property.updated_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MyTenants;
