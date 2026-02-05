
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AnimatedDiv, fadeInUp } from '@/components/ui/animated-components';

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const CategorySelect = ({ value, onChange }: CategorySelectProps) => {
  return (
    <AnimatedDiv className="space-y-2" {...fadeInUp}>
      <Label htmlFor="category" className="text-sm font-medium text-gray-700">
        Category *
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="transition-all duration-200 hover:shadow-md">
          <SelectValue placeholder="Select issue category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="plumbing">🔧 Plumbing</SelectItem>
          <SelectItem value="electrical">⚡ Electrical</SelectItem>
          <SelectItem value="hvac">🌡️ HVAC</SelectItem>
          <SelectItem value="appliances">🔌 Appliances</SelectItem>
          <SelectItem value="other">📋 Other</SelectItem>
        </SelectContent>
      </Select>
    </AnimatedDiv>
  );
};
