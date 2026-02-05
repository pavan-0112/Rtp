
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { AnimatedDiv, AnimatedForm, fadeInUp } from '@/components/ui/animated-components';
import { AuthCard } from '@/components/auth/AuthCard';
import { FormField } from '@/components/ui/form-field';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('Welcome back!', {
        description: 'You have successfully logged in.'
      });
      
      // Get user role from localStorage to redirect appropriately
      const user = JSON.parse(localStorage.getItem('propertyUser') || '{}');
      if (user.role === 'landlord') {
        navigate('/landlord-dashboard');
      } else {
        navigate('/tenant-dashboard');
      }
    } catch (error) {
      toast.error('Login failed', {
        description: 'Please check your email and password and try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard 
      title="Welcome Back" 
      subtitle="Sign in to continue to your dashboard"
    >
      <AnimatedForm 
        onSubmit={handleSubmit} 
        className="space-y-6"
        {...fadeInUp}
      >
        <FormField
          id="email"
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={setEmail}
          required
          showSuccess={!!email && !email.includes(' ')}
        />
        
        <FormField
          id="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={setPassword}
          required
          showSuccess={password.length >= 6}
        />
        
        <AnimatedDiv {...fadeInUp}>
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </AnimatedDiv>
      </AnimatedForm>
      
      <AnimatedDiv 
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link 
            to="/register" 
            className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
          >
            Create one now
          </Link>
        </p>
      </AnimatedDiv>
    </AuthCard>
  );
};

export default Login;
