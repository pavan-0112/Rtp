
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Users, CheckCircle, MessageCircle } from 'lucide-react';

interface DashboardStatsProps {
  propertiesCount: number;
  tenantsCount: number;
  applicationsCount: number;
}

const DashboardStats = ({ propertiesCount, tenantsCount, applicationsCount }: DashboardStatsProps) => {
  const stats = [
    { title: 'Total Properties', value: propertiesCount.toString(), icon: Building, color: 'bg-blue-500' },
    { title: 'Active Tenants', value: tenantsCount.toString(), icon: Users, color: 'bg-green-500' },
    { title: 'Pending Applications', value: applicationsCount.toString(), icon: CheckCircle, color: 'bg-orange-500' },
    { title: 'Messages', value: '3', icon: MessageCircle, color: 'bg-purple-500' }
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

export default DashboardStats;
