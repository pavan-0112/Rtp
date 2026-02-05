
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building } from 'lucide-react';
import { AnimatedDiv, AnimatedCard, scaleIn, fadeIn } from '@/components/ui/animated-components';

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const AuthCard = ({ title, subtitle, children }: AuthCardProps) => {
  return (
    <AnimatedDiv 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-100 flex items-center justify-center p-6"
      {...fadeIn}
    >
      <AnimatedCard 
        className="w-full max-w-md shadow-xl border-0"
        {...scaleIn}
      >
        <Card>
          <CardHeader className="text-center pb-2">
            <AnimatedDiv 
              className="flex items-center justify-center space-x-2 mb-4"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <Building className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                PropertyPro
              </span>
            </AnimatedDiv>
            <CardTitle className="text-2xl text-gray-800">{title}</CardTitle>
            <p className="text-gray-600">{subtitle}</p>
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
        </Card>
      </AnimatedCard>
    </AnimatedDiv>
  );
};
