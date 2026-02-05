
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TenantQuickActions = () => {
  const quickActions = [
    { title: 'Browse Properties', description: 'Look for available properties to rent', link: '/properties', color: 'bg-blue-600' },
    { title: 'Submit Maintenance Request', description: 'Report issues or request repairs', link: '/maintenance', color: 'bg-orange-600' },
    { title: 'Verify Property Status', description: 'Check government property verification', link: '/property-verification', color: 'bg-purple-600' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {quickActions.map((action, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer border-0 shadow-md">
          <Link to={action.link}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${action.color}`}></div>
                <span className="text-sm">{action.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">{action.description}</p>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  );
};

export default TenantQuickActions;
