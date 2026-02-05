
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { AnimatedDiv, fadeInUp } from '@/components/ui/animated-components';

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  showSuccess?: boolean;
}

export const FormField = ({ 
  id, 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error, 
  required = false,
  showSuccess = false
}: FormFieldProps) => {
  const hasError = !!error;
  const hasSuccess = showSuccess && value && !hasError;

  return (
    <AnimatedDiv className="space-y-2" {...fadeInUp}>
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`transition-all duration-200 focus:scale-[1.02] focus:shadow-md ${
            hasError ? 'border-red-500' : hasSuccess ? 'border-green-500' : ''
          }`}
          required={required}
        />
        {hasSuccess && (
          <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
        )}
        {hasError && (
          <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
        )}
      </div>
      {hasError && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </AnimatedDiv>
  );
};
