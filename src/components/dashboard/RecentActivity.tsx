
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      title: 'New tenant application received',
      description: 'Property: Sunset Apartments #205',
      color: 'bg-green-500'
    },
    {
      id: 2,
      title: 'Maintenance request submitted',
      description: 'Property: Downtown Loft #12',
      color: 'bg-orange-500'
    },
    {
      id: 3,
      title: 'Monthly rent payment received',
      description: 'Tenant: John Smith',
      color: 'bg-blue-500'
    }
  ];

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-2 h-2 ${activity.color} rounded-full`}></div>
              <div>
                <p className="font-medium">{activity.title}</p>
                <p className="text-sm text-gray-600">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
