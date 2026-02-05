
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedDiv, scaleIn } from '@/components/ui/animated-components';
import { Wrench, AlertTriangle } from 'lucide-react';

export const EmptyPropertiesMessage = () => {
  return (
    <AnimatedDiv {...scaleIn}>
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-gray-600">
            <Wrench className="h-5 w-5" />
            <span>Submit New Maintenance Request</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Rental Properties</h3>
            <p className="text-gray-600">
              You need to be renting a property to submit maintenance requests. 
              Browse available properties and apply to rent one first.
            </p>
          </div>
        </CardContent>
      </Card>
    </AnimatedDiv>
  );
};
