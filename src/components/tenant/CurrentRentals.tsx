
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, User, MapPin, DollarSign, Wrench, MessageCircle, Mail, Phone } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  address: string;
  rent: number;
  type: 'occupied' | 'approved';
  application_date?: string;
  landlord?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}

interface CurrentRentalsProps {
  currentRentals: Property[];
}

const CurrentRentals = ({ currentRentals }: CurrentRentalsProps) => {
  if (currentRentals.length === 0) {
    return null;
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Home className="h-5 w-5 text-blue-600" />
          <span>Current Rentals ({currentRentals.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentRentals.map((rental) => (
            <div key={rental.id} className={`p-6 rounded-lg border ${
              rental.type === 'occupied' 
                ? 'bg-gradient-to-r from-blue-50 to-green-50 border-blue-200' 
                : 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200'
            }`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {rental.title || 'Property Title Not Available'}
                    </h3>
                    <p className="text-gray-600 flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {rental.address || 'Address not available'}
                    </p>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="text-2xl font-bold text-green-600">
                      <DollarSign className="h-5 w-5 inline mr-1" />
                      {rental.rent || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500">per month</p>
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                      rental.type === 'occupied' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {rental.type === 'occupied' ? 'Currently Renting' : 'Approved - Ready to Move'}
                    </span>
                  </div>
                </div>

                {rental.landlord && (
                  <div className="bg-white/60 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Landlord Contact Information
                    </h4>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-2 text-gray-400" />
                        <span className="font-medium">Name:</span>
                        <span className="ml-2">{rental.landlord.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-3 w-3 mr-2 text-gray-400" />
                        <span className="font-medium">Email:</span>
                        <span className="ml-2">{rental.landlord.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 mr-2 text-gray-400" />
                        <span className="font-medium">Phone:</span>
                        <span className="ml-2">{rental.landlord.phone}</span>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="h-3 w-3 mr-2 mt-0.5 text-gray-400" />
                        <span className="font-medium">Address:</span>
                        <span className="ml-2">{rental.landlord.address}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 pt-2">
                      Landlord ID: {rental.landlord.id.slice(0, 8)}...
                    </div>
                  </div>
                )}

                <div className={`pt-4 border-t ${
                  rental.type === 'occupied' ? 'border-blue-200' : 'border-green-200'
                }`}>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">
                        {rental.type === 'occupied' ? 'Next Payment Due' : 'Application Approved'}
                      </p>
                      <p className="font-medium">
                        {rental.type === 'occupied' 
                          ? '1st of each month' 
                          : rental.application_date ? new Date(rental.application_date).toLocaleDateString() : 'N/A'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Status</p>
                      <p className="font-medium text-green-600">
                        {rental.type === 'occupied' ? 'Active Lease' : 'Ready to Move In'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="pt-2 flex space-x-2">
                  <Button asChild variant="outline" className="flex-1">
                    <Link to="/maintenance">
                      <Wrench className="h-4 w-4 mr-2" />
                      Maintenance Request
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link to="/maintenance">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact Landlord
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentRentals;
