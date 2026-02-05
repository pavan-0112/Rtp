
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AnimatedDiv, fadeInUp } from '@/components/ui/animated-components';

interface PrioritySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const PrioritySelect = ({ value, onChange }: PrioritySelectProps) => {
  return (
    <AnimatedDiv className="space-y-2" {...fadeInUp}>
      <Label htmlFor="priority" className="text-sm font-medium text-gray-700">
        Priority Level *
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="transition-all duration-200 hover:shadow-md">
          <SelectValue placeholder="Select priority level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="low" className="text-green-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Low Priority</span>
            </div>
          </SelectItem>
          <SelectItem value="medium" className="text-yellow-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>Medium Priority</span>
            </div>
          </SelectItem>
          <SelectItem value="high" className="text-red-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>High Priority</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </AnimatedDiv>
  );
};
