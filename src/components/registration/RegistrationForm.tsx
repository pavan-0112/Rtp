import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Building, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FormData, ValidationErrors } from '@/utils/registrationValidation';

interface RegistrationFormProps {
  formData: FormData;
  validationErrors: ValidationErrors;
  isLoading: boolean;
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const RegistrationForm = ({ 
  formData, 
  validationErrors, 
  isLoading, 
  onInputChange, 
  onSubmit 
}: RegistrationFormProps) => {
  const getFieldStatus = (field: string) => {
    if (validationErrors[field]) return 'error';
    if (formData[field as keyof typeof formData] && !validationErrors[field]) return 'success';
    return 'default';
  };

  const isMgitEmail = formData.email.toLowerCase().endsWith('@mgit.ac.in');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Building className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">PropertyPro</span>
          </div>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <p className="text-gray-600">Join our property management platform</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <div className="relative">
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => onInputChange('name', e.target.value)}
                  className={validationErrors.name ? 'border-red-500' : getFieldStatus('name') === 'success' ? 'border-green-500' : ''}
                  required
                />
                {getFieldStatus('name') === 'success' && (
                  <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                )}
                {validationErrors.name && (
                  <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                )}
              </div>
              {validationErrors.name && (
                <p className="text-sm text-red-500">{validationErrors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => onInputChange('email', e.target.value)}
                  className={validationErrors.email ? 'border-red-500' : getFieldStatus('email') === 'success' ? 'border-green-500' : ''}
                  required
                />
                {getFieldStatus('email') === 'success' && (
                  <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                )}
                {validationErrors.email && (
                  <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                )}
              </div>
              {validationErrors.email && (
                <p className="text-sm text-red-500">{validationErrors.email}</p>
              )}
              {isMgitEmail && formData.email && (
                <div className="flex items-start space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-700">
                    MGIT email detected! Your account will be created instantly without email verification.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Mobile Number</Label>
              <div className="relative">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={formData.phone}
                  onChange={(e) => onInputChange('phone', e.target.value)}
                  className={validationErrors.phone ? 'border-red-500' : getFieldStatus('phone') === 'success' ? 'border-green-500' : ''}
                />
                {getFieldStatus('phone') === 'success' && (
                  <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                )}
                {validationErrors.phone && (
                  <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                )}
              </div>
              {validationErrors.phone && (
                <p className="text-sm text-red-500">{validationErrors.phone}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label>Account Type *</Label>
              <RadioGroup
                value={formData.role}
                onValueChange={(value) => onInputChange('role', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tenant" id="tenant" />
                  <Label htmlFor="tenant">Tenant - Looking for properties</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="landlord" id="landlord" />
                  <Label htmlFor="landlord">Landlord - Managing properties</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password (min 6 characters)"
                  value={formData.password}
                  onChange={(e) => onInputChange('password', e.target.value)}
                  className={validationErrors.password ? 'border-red-500' : getFieldStatus('password') === 'success' ? 'border-green-500' : ''}
                  required
                />
                {getFieldStatus('password') === 'success' && (
                  <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                )}
                {validationErrors.password && (
                  <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                )}
              </div>
              {validationErrors.password && (
                <p className="text-sm text-red-500">{validationErrors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => onInputChange('confirmPassword', e.target.value)}
                  className={validationErrors.confirmPassword ? 'border-red-500' : getFieldStatus('confirmPassword') === 'success' ? 'border-green-500' : ''}
                  required
                />
                {getFieldStatus('confirmPassword') === 'success' && (
                  <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                )}
                {validationErrors.confirmPassword && (
                  <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                )}
              </div>
              {validationErrors.confirmPassword && (
                <p className="text-sm text-red-500">{validationErrors.confirmPassword}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || Object.keys(validationErrors).length > 0}
            >
              {isLoading ? 'Creating Account...' : `Create ${formData.role === 'landlord' ? 'Landlord' : 'Tenant'} Account`}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationForm;
