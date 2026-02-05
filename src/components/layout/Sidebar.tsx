
import { Home, Building, Users, Wrench, FileCheck, MessageSquare, CreditCard } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AnimatedDiv, fadeInUp, staggerContainer } from '@/components/ui/animated-components';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const { user } = useAuth();

  const landlordItems = [
    { icon: Home, label: 'Dashboard', to: '/landlord-dashboard' },
    { icon: Building, label: 'Properties', to: '/properties' },
    { icon: Users, label: 'Tenants', to: '/tenants' },
    { icon: Wrench, label: 'Maintenance', to: '/maintenance' },
    { icon: FileCheck, label: 'Verification', to: '/property-verification' },
  ];

  const tenantItems = [
    { icon: Home, label: 'Dashboard', to: '/tenant-dashboard' },
    { icon: Building, label: 'Properties', to: '/properties' },
    { icon: Home, label: 'My Rentals', to: '/my-rentals' },
    { icon: CreditCard, label: 'Pay Rent', to: '/pay-rent' },
    { icon: Wrench, label: 'Maintenance', to: '/maintenance' },
    { icon: FileCheck, label: 'Verification', to: '/property-verification' },
  ];

  const items = user?.role === 'landlord' ? landlordItems : tenantItems;

  return (
    <AnimatedDiv 
      className="w-64 bg-white border-r border-gray-200 h-full"
      {...staggerContainer}
    >
      <nav className="p-4 space-y-2">
        {items.map((item, index) => (
          <AnimatedDiv
            key={item.to}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          </AnimatedDiv>
        ))}
      </nav>
    </AnimatedDiv>
  );
};

export default Navigation;
