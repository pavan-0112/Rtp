
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const ConfirmAccount = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    const confirmAccount = async () => {
      const token = searchParams.get('token');
      const email = searchParams.get('email');

      if (!token || !email) {
        setStatus('error');
        toast.error('Invalid confirmation link');
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('confirm-account', {
          body: { token, email }
        });

        if (error) {
          console.error('Confirmation error:', error);
          setStatus('error');
          toast.error('Failed to confirm account. The link may be invalid or expired.');
          return;
        }

        if (data.success) {
          setStatus('success');
          setUserRole(data.user.role);
          toast.success('Account confirmed successfully! You can now log in.');
        } else {
          setStatus('error');
          toast.error(data.error || 'Failed to confirm account');
        }
      } catch (error) {
        console.error('Confirmation error:', error);
        setStatus('error');
        toast.error('Failed to confirm account. Please try again.');
      }
    };

    confirmAccount();
  }, [searchParams]);

  const handleContinue = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Building className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">PropertyPro</span>
          </div>
          <CardTitle className="text-2xl">
            {status === 'loading' && 'Confirming Account...'}
            {status === 'success' && 'Account Confirmed!'}
            {status === 'error' && 'Confirmation Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex justify-center">
            {status === 'loading' && (
              <div className="bg-blue-100 p-4 rounded-full">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
            )}
            {status === 'success' && (
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            )}
            {status === 'error' && (
              <div className="bg-red-100 p-4 rounded-full">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            )}
          </div>

          {status === 'loading' && (
            <p className="text-gray-600">
              Please wait while we confirm your account...
            </p>
          )}

          {status === 'success' && (
            <div className="space-y-2">
              <p className="text-gray-600">
                Your {userRole} account has been successfully confirmed!
              </p>
              <p className="text-sm text-gray-500">
                You can now log in and start using PropertyPro.
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-2">
              <p className="text-gray-600">
                We couldn't confirm your account. The confirmation link may be invalid or expired.
              </p>
              <p className="text-sm text-gray-500">
                Please try registering again or contact support.
              </p>
            </div>
          )}

          {status !== 'loading' && (
            <div className="space-y-2 pt-4">
              <Button onClick={handleContinue} className="w-full">
                {status === 'success' ? 'Continue to Login' : 'Go to Registration'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmAccount;
