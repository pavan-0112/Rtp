
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AnimatedDiv, fadeInUp } from '@/components/ui/animated-components';

interface FormFieldProps {
  id: string;
  label: string;
  type?: 'input' | 'textarea';
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  rows?: number;
}

export const FormField = ({ 
  id, 
  label, 
  type = 'input', 
  placeholder, 
  value, 
  onChange, 
  required = false,
  rows = 4
}: FormFieldProps) => {
  return (
    <AnimatedDiv className="space-y-2" {...fadeInUp}>
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label} {required && '*'}
      </Label>
      {type === 'textarea' ? (
        <Textarea
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          required={required}
          className="transition-all duration-200 focus:scale-[1.01] focus:shadow-md resize-none"
        />
      ) : (
        <Input
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="transition-all duration-200 focus:scale-[1.02] focus:shadow-md"
        />
      )}
    </AnimatedDiv>
  );
};
