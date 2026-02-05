
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Application {
  id: string;
  status: string;
  properties?: {
    title: string;
    address: string;
  };
}

interface RecentApplicationsProps {
  applications: Application[];
}

const RecentApplications = ({ applications }: RecentApplicationsProps) => {
  if (applications.length === 0) {
    return null;
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle>Recent Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications.slice(0, 3).map((app) => (
            <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">
                  {app.properties?.title || 'Property Not Found'}
                </p>
                <p className="text-sm text-gray-600">
                  {app.properties?.address || 'Address unavailable'}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                app.status === 'approved' 
                  ? 'bg-green-100 text-green-800'
                  : app.status === 'rejected'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {app.status}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentApplications;
