
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const QuickActions = () => {
  const quickActions = [
    { title: 'Add New Property', description: 'List a new property for rent', link: '/properties', color: 'bg-blue-600' },
    { title: 'Manage Tenants', description: 'View and manage tenant information', link: '/tenants', color: 'bg-green-600' },
    { title: 'Maintenance Requests', description: 'Review pending maintenance requests', link: '/maintenance', color: 'bg-orange-600' },
    { title: 'Verify Property', description: 'Check government property status', link: '/property-verification', color: 'bg-purple-600' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {quickActions.map((action, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer border-0 shadow-md">
          <Link to={action.link}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${action.color}`}></div>
                <span>{action.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{action.description}</p>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  );
};

export default QuickActions;
