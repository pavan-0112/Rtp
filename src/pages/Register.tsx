
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  validateField, 
  ValidationErrors, 
  FormData 
} from '@/utils/registrationValidation';
import { registerUser } from '@/services/registrationService';
import RegistrationForm from '@/components/registration/RegistrationForm';

const Register = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'tenant'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Update validation for this field (synchronous validation only)
    const newErrors = validateField(field, value, formData);
    
    setValidationErrors(prev => {
      const updatedErrors = { ...prev };
      
      // Remove old error if it's now valid
      if (!newErrors[field] && updatedErrors[field]) {
        delete updatedErrors[field];
      }
      
      // Add new error if invalid
      if (newErrors[field]) {
        updatedErrors[field] = newErrors[field];
      }
      
      return updatedErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    try {
      const result = await registerUser(formData);
      
      if (!result.success) {
        if (result.validationErrors) {
          setValidationErrors(result.validationErrors);
          toast.error('Please fix the validation errors before submitting');
          return;
        }
        
        if (result.error?.includes('email')) {
          setValidationErrors({ email: 'Email already in use or verification failed' });
        }
        throw new Error(result.error);
      }

      toast.success('Account created successfully! Welcome to PropertyPro! 🎉', {
        description: 'You are now logged in and a welcome email has been sent.'
      });
      
      // Redirect based on user role (they're auto-logged in)
      if (formData.role === 'landlord') {
        navigate('/landlord-dashboard');
      } else {
        navigate('/tenant-dashboard');
      }
      
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegistrationForm
      formData={formData}
      validationErrors={validationErrors}
      isLoading={isLoading}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
    />
  );
};

export default Register;
