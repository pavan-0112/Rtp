
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

const EmptyRentalsState = () => {
  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-12 text-center">
        <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Rentals Yet</h3>
        <p className="text-gray-600 mb-6">
          You don't have any approved or occupied rentals at the moment.
        </p>
        <Button asChild>
          <Link to="/properties">Browse Properties</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyRentalsState;
