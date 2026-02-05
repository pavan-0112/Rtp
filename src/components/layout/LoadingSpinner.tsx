
import { AnimatedDiv, fadeIn } from '@/components/ui/animated-components';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const LoadingSpinner = ({ size = 'md', text = 'Loading...' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <AnimatedDiv 
      className="flex flex-col items-center justify-center py-12"
      {...fadeIn}
    >
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 border-blue-600 mb-4`}></div>
      <p className="text-gray-600 text-sm">{text}</p>
    </AnimatedDiv>
  );
};
