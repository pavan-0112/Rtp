
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Mail, Clock, CheckCircle } from 'lucide-react';
import { AnimatedDiv, AnimatedCard, fadeIn, scaleIn } from '@/components/ui/animated-components';

const EmailConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleGoToLogin = () => {
    navigate('/login');
  };

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
            <CardTitle className="text-2xl text-gray-800">Check Your Email</CardTitle>
            <p className="text-gray-600">We've sent you a confirmation link</p>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <AnimatedDiv 
              className="bg-blue-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <Mail className="h-8 w-8 text-blue-600" />
            </AnimatedDiv>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Confirmation Email Sent
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We've sent a confirmation email to:
              </p>
              {email && (
                <p className="font-medium text-blue-600 bg-blue-50 px-3 py-2 rounded-md break-all">
                  {email}
                </p>
              )}
              <p className="text-gray-600 text-sm leading-relaxed">
                Please click the confirmation link in the email to activate your account.
              </p>
            </div>

            <AnimatedDiv 
              className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-start space-x-2">
                <Clock className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-medium text-yellow-800">
                    Email not received?
                  </p>
                  <ul className="text-xs text-yellow-700 mt-1 space-y-1">
                    <li>• Check your spam/junk folder</li>
                    <li>• Make sure the email address is correct</li>
                    <li>• Wait a few minutes for delivery</li>
                  </ul>
                </div>
              </div>
            </AnimatedDiv>

            <div className="space-y-3 pt-4">
              <Button 
                onClick={handleGoToLogin} 
                variant="outline" 
                className="w-full"
              >
                Back to Login
              </Button>
              <p className="text-xs text-gray-500">
                Already confirmed your email? You can now sign in to your account.
              </p>
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>
    </AnimatedDiv>
  );
};

export default EmailConfirmation;
