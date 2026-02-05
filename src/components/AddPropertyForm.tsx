
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Copy } from 'lucide-react';

interface AddPropertyFormProps {
  onPropertyAdded: () => void;
}

const AddPropertyForm: React.FC<AddPropertyFormProps> = ({ onPropertyAdded }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPropertyId, setNewPropertyId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    rent: '',
    description: '',
    status: 'available'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert({
          title: formData.title,
          address: formData.address,
          rent: parseFloat(formData.rent),
          description: formData.description,
          status: formData.status,
          tenant_id: user.role === 'tenant' ? user.id : null,
          landlord_id: user.role === 'landlord' ? user.id : null
        })
        .select()
        .single();

      if (error) throw error;

      // Show the generated property ID to the landlord
      setNewPropertyId(data.property_id);
      toast.success('Property added successfully!');
      setFormData({ title: '', address: '', rent: '', description: '', status: 'available' });
      onPropertyAdded();
    } catch (error) {
      console.error('Error adding property:', error);
      toast.error('Failed to add property');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyPropertyId = () => {
    if (newPropertyId) {
      navigator.clipboard.writeText(newPropertyId);
      toast.success('Property ID copied to clipboard!');
    }
  };

  const handleNewProperty = () => {
    setNewPropertyId(null);
  };

  // Show success message with property ID after creation
  if (newPropertyId) {
    return (
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-green-600">Property Created Successfully!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Your Property ID</p>
                  <p className="text-xl font-mono font-bold text-green-800">{newPropertyId}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={copyPropertyId}
                className="text-green-600 border-green-600 hover:bg-green-50"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy ID
              </Button>
            </div>
          </div>
          
          <div className="space-y-3 text-sm text-gray-600 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800">Important Information:</h4>
            <p>• Share this Property ID with potential tenants</p>
            <p>• Tenants can use this ID to verify your property ownership</p>
            <p>• This ID is displayed on your property listing</p>
            <p>• Keep this ID safe - it proves your ownership of the property</p>
          </div>

          <div className="flex space-x-3">
            <Button onClick={handleNewProperty} className="flex-1">
              Add Another Property
            </Button>
            <Button variant="outline" onClick={onPropertyAdded} className="flex-1">
              Done
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle>Add New Property</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Property Title</Label>
              <Input
                id="title"
                placeholder="e.g., Downtown Apartment"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rent">Monthly Rent ($)</Label>
              <Input
                id="rent"
                type="number"
                placeholder="1200"
                value={formData.rent}
                onChange={(e) => setFormData(prev => ({ ...prev, rent: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="123 Main Street, City, State"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="maintenance">Under Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Property description, amenities, etc."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>
          
          <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
            <p className="font-medium mb-1">📋 What happens next:</p>
            <p>A unique Property ID will be generated for verification purposes</p>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding Property...' : 'Add Property'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddPropertyForm;
