
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { AnimatedDiv, AnimatedForm, fadeInUp, scaleIn } from '@/components/ui/animated-components';
import { Wrench, CheckCircle } from 'lucide-react';
import { FormField } from './form/FormField';
import { PrioritySelect } from './form/PrioritySelect';
import { CategorySelect } from './form/CategorySelect';
import { PropertySelect } from './form/PropertySelect';
import { EmptyPropertiesMessage } from './form/EmptyPropertiesMessage';

interface Property {
  id: string;
  title: string;
  address: string;
  landlord_id: string | null;
  tenant_id: string | null;
}

interface MaintenanceRequestFormProps {
  properties: Property[];
  onRequestSubmitted: () => void;
}

export const MaintenanceRequestForm = ({ properties, onRequestSubmitted }: MaintenanceRequestFormProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '',
    category: '',
    property_id: ''
  });

  // Filter properties to include both occupied and approved properties
  const availableProperties = properties.filter(property => 
    property.tenant_id === user?.id || 
    // Also check for approved applications for this tenant
    property.id
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.property_id) {
      toast.error('Please select a property for this maintenance request');
      return;
    }

    // Verify the selected property is accessible by this tenant
    const selectedProperty = availableProperties.find(p => p.id === formData.property_id);
    if (!selectedProperty) {
      toast.error('You can only submit maintenance requests for properties you are renting or have been approved for');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('maintenance_requests')
        .insert({
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          category: formData.category,
          property_id: formData.property_id,
          tenant_id: user.id,
          status: 'pending'
        });

      if (error) throw error;

      toast.success('Maintenance request submitted!', {
        description: 'Your landlord has been notified and will respond soon.',
        icon: <CheckCircle className="h-4 w-4" />
      });
      
      setFormData({ title: '', description: '', priority: '', category: '', property_id: '' });
      onRequestSubmitted();
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Failed to submit request', {
        description: 'Please try again or contact support.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show message if no available properties
  if (availableProperties.length === 0) {
    return <EmptyPropertiesMessage />;
  }

  return (
    <AnimatedDiv {...scaleIn}>
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <Wrench className="h-5 w-5" />
            <span>Submit New Maintenance Request</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <AnimatedForm onSubmit={handleSubmit} className="space-y-6" {...fadeInUp}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                id="title"
                label="Issue Title"
                placeholder="Brief description of the issue"
                value={formData.title}
                onChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
                required
              />
              
              <PrioritySelect
                value={formData.priority}
                onChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CategorySelect
                value={formData.category}
                onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              />
              
              <PropertySelect
                properties={availableProperties}
                value={formData.property_id}
                onChange={(value) => setFormData(prev => ({ ...prev, property_id: value }))}
              />
            </div>
            
            <FormField
              id="description"
              label="Detailed Description"
              type="textarea"
              placeholder="Please provide a detailed description of the issue, including when it started and any steps you've already taken..."
              value={formData.description}
              onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
              required
              rows={4}
            />
            
            <AnimatedDiv {...fadeInUp}>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting Request...
                  </>
                ) : (
                  <>
                    <Wrench className="mr-2 h-4 w-4" />
                    Submit Maintenance Request
                  </>
                )}
              </Button>
            </AnimatedDiv>
          </AnimatedForm>
        </CardContent>
      </Card>
    </AnimatedDiv>
  );
};
