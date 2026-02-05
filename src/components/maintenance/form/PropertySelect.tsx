
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AnimatedDiv, fadeInUp } from '@/components/ui/animated-components';

interface Property {
  id: string;
  title: string;
  address: string;
  landlord_id: string | null;
  tenant_id: string | null;
}

interface PropertySelectProps {
  properties: Property[];
  value: string;
  onChange: (value: string) => void;
}

export const PropertySelect = ({ properties, value, onChange }: PropertySelectProps) => {
  return (
    <AnimatedDiv className="space-y-2" {...fadeInUp}>
      <Label htmlFor="property" className="text-sm font-medium text-gray-700">
        Your Rental Property *
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="transition-all duration-200 hover:shadow-md">
          <SelectValue placeholder="Select your rental property" />
        </SelectTrigger>
        <SelectContent>
          {properties.map((property) => (
            <SelectItem key={property.id} value={property.id}>
              <div className="flex flex-col">
                <span className="font-medium">{property.title}</span>
                <span className="text-xs text-gray-500">{property.address}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </AnimatedDiv>
  );
};
