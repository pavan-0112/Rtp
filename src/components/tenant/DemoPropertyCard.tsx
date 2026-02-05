
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, DollarSign, User, Mail, Phone, Home, Wrench, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const DemoPropertyCard = () => {
  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-6">
        <div className="p-6 rounded-lg border bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900">
                  Modern Downtown Apartment
                </h3>
                <p className="text-gray-600 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  123 Main Street, Downtown City, State 12345
                </p>
              </div>
              <div className="text-right space-y-2">
                <p className="text-2xl font-bold text-green-600">
                  <DollarSign className="h-5 w-5 inline mr-1" />
                  1,200
                </p>
                <p className="text-sm text-gray-500">per month</p>
                <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  Currently Renting
                </span>
              </div>
            </div>

            <div className="bg-white/60 p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Landlord Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center">
                  <User className="h-3 w-3 mr-2 text-gray-400" />
                  <span className="font-medium">Name:</span>
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
                <div className="flex items-start">
                  <Home className="h-3 w-3 mr-2 mt-0.5 text-gray-400" />
                  <span className="font-medium">Address:</span>
                  <span className="ml-2">456 Oak Avenue, Landlord District</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 pt-2">
                Landlord ID: abcd1234...
              </div>
            </div>

            <div className="pt-4 border-t border-blue-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Next Payment Due</p>
                  <p className="font-medium">1st of each month</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <p className="font-medium text-green-600">Active Lease</p>
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
      </CardContent>
    </Card>
  );
};

export default DemoPropertyCard;
