
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DashboardLayout from '../components/DashboardLayout';
import { useCurrentRentals } from '../hooks/useCurrentRentals';
import RentalCard from '../components/tenant/RentalCard';
import EmptyRentalsState from '../components/tenant/EmptyRentalsState';
import DemoPropertyCard from '../components/tenant/DemoPropertyCard';
import SampleDataCard from '../components/tenant/SampleDataCard';

const MyRentals = () => {
  const { currentRentals, loading } = useCurrentRentals();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading your rentals...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">My Rentals</h1>
          <Button asChild>
            <Link to="/properties">Browse More Properties</Link>
          </Button>
        </div>

        {currentRentals.length === 0 ? (
          <div className="space-y-6">
            <EmptyRentalsState />
            
            {/* Demo Section */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Demo Rental (Sample Data)</h2>
              <p className="text-gray-600 mb-4">
                This is how your rental will appear once your application is approved by a landlord.
              </p>
              <DemoPropertyCard />
            </div>

            <SampleDataCard
              title="No Active Rentals Yet"
              description="Apply for properties to see them here once approved. The demo above shows how your approved rentals will look."
              actionText="Browse Properties"
              onAction={() => window.location.href = '/properties'}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {currentRentals.map((rental) => (
              <RentalCard key={rental.id} rental={rental} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyRentals;
