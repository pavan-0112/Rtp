
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Clock, Wrench, MessageCircle } from 'lucide-react';

interface TenantStatsProps {
  currentRentalsCount: number;
  pendingApplicationsCount: number;
  maintenanceRequestsCount: number;
  activeCommunicationsCount: number;
}

const TenantStats = ({ 
  currentRentalsCount, 
  pendingApplicationsCount, 
  maintenanceRequestsCount, 
  activeCommunicationsCount 
}: TenantStatsProps) => {
  const stats = [
    { 
      title: 'Current Rentals', 
      value: currentRentalsCount.toString(), 
      icon: Home, 
      color: currentRentalsCount > 0 ? 'bg-blue-500' : 'bg-gray-500' 
    },
    { 
      title: 'Pending Applications', 
      value: pendingApplicationsCount.toString(), 
      icon: Clock, 
      color: 'bg-orange-500' 
    },
    { 
      title: 'Maintenance Requests', 
      value: maintenanceRequestsCount.toString(), 
      icon: Wrench, 
      color: 'bg-purple-500' 
    },
    { 
      title: 'Active Communications', 
      value: activeCommunicationsCount.toString(), 
      icon: MessageCircle, 
      color: 'bg-green-500' 
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${stat.color} text-white`}>
              <stat.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TenantStats;
