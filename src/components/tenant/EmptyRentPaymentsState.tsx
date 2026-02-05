
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';

const EmptyRentPaymentsState = () => {
  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-12 text-center">
        <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Rent Payments Due</h3>
        <p className="text-gray-600 mb-6">
          You don't have any pending rent payments at the moment.
        </p>
        <Button asChild>
          <Link to="/my-rentals">View My Rentals</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyRentPaymentsState;
