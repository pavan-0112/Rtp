
import { AnimatedDiv, fadeInUp } from '@/components/ui/animated-components';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
  return (
    <AnimatedDiv 
      className="text-center py-12"
      {...fadeInUp}
    >
      <div className="bg-gray-50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-md mx-auto mb-6">{description}</p>
      {action && action}
    </AnimatedDiv>
  );
};
