
import { Button } from '@/components/ui/button';
import { Building, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AnimatedDiv, fadeInUp } from '@/components/ui/animated-components';
import { NotificationCenter } from '../ui/notification-center';

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <AnimatedDiv 
      className="bg-white border-b border-gray-200 px-6 py-4"
      {...fadeInUp}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Building className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              PropertyPro
            </h1>
            <p className="text-xs text-gray-500 capitalize">{user?.role} Dashboard</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <NotificationCenter />
          
          <div className="flex items-center space-x-2 text-gray-700">
            <User className="h-4 w-4" />
            <span className="text-sm font-medium">{user?.name}</span>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleLogout}
            className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </AnimatedDiv>
  );
};
