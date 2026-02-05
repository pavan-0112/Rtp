
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User, Phone, MapPin, Save } from 'lucide-react';

interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  role: string | null;
}

export const ProfileEdit = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      // Get the current authenticated user from Supabase
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          address: data.address || ''
        });
      } else {
        // Create profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user?.id,
            name: supabaseUser?.user_metadata?.name || user?.name || '',
            email: user?.email,
            role: supabaseUser?.user_metadata?.role || user?.role || 'tenant'
          })
          .select()
          .single();

        if (createError) throw createError;
        setProfile(newProfile);
        setFormData({
          name: newProfile.name || '',
          phone: newProfile.phone || '',
          address: newProfile.address || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      // Get the current authenticated user from Supabase
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          email: user.email,
          role: supabaseUser?.user_metadata?.role || profile?.role || user.role || 'tenant',
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Profile updated successfully!');
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5 text-blue-600" />
          <span>Edit Profile</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center space-x-1">
              <Phone className="h-4 w-4" />
              <span>Phone Number</span>
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Enter your phone number"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>Address</span>
            </Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Enter your address"
              rows={3}
            />
          </div>

          <Button type="submit" disabled={isSaving} className="w-full">
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Profile
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
