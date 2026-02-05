
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, Plus } from 'lucide-react';

interface SampleDataCardProps {
  title: string;
  description: string;
  actionText: string;
  onAction: () => void;
}

const SampleDataCard = ({ title, description, actionText, onAction }: SampleDataCardProps) => {
  return (
    <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
      <CardContent className="p-8 text-center">
        <div className="bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Info className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
        <Button onClick={onAction} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          {actionText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SampleDataCard;
