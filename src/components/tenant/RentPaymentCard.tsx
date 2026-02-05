
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, MapPin, Calendar, CreditCard, User, Mail, Phone, Home } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface RentPayment {
  id: string;
  property_id: string;
  amount: number;
  due_date: string;
  status: string;
  payment_method?: string;
  transaction_id?: string;
  properties: {
    title: string;
    address: string;
    landlord_id: string;
    landlord?: {
      id: string;
      name: string;
      email: string;
      phone: string;
      address: string;
    };
  };
}

interface RentPaymentCardProps {
  payment: RentPayment;
  onPaymentUpdate: () => void;
}

const RentPaymentCard = ({ payment, onPaymentUpdate }: RentPaymentCardProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayRent = async () => {
    try {
      setIsProcessing(true);
      
      // Simulate payment processing
      const { error } = await supabase
        .from('rent_payments')
        .update({ 
          status: 'paid',
          payment_date: new Date().toISOString(),
          payment_method: 'credit_card',
          transaction_id: `txn_${Date.now()}`
        })
        .eq('id', payment.id);

      if (error) throw error;

      toast({
        title: "Payment Successful",
        description: "Your rent payment has been processed successfully.",
      });

      onPaymentUpdate();
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const isOverdue = new Date(payment.due_date) < new Date() && payment.status === 'pending';
  const isPaid = payment.status === 'paid';

  return (
    <Card className={`border-0 shadow-md ${isPaid ? 'bg-green-50' : isOverdue ? 'bg-red-50' : 'bg-white'}`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900">
                {payment.properties.title}
              </h3>
              <p className="text-gray-600 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {payment.properties.address}
              </p>
            </div>
            <div className="text-right space-y-2">
              <p className="text-2xl font-bold text-green-600">
                <DollarSign className="h-5 w-5 inline mr-1" />
                {payment.amount}
              </p>
              <p className="text-sm text-gray-500">monthly rent</p>
              <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                isPaid 
                  ? 'bg-green-100 text-green-800' 
                  : isOverdue 
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {isPaid ? 'Paid' : isOverdue ? 'Overdue' : 'Pending'}
              </span>
            </div>
          </div>

          {/* Landlord Information Section */}
          {payment.properties.landlord && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Landlord Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center">
                  <User className="h-3 w-3 mr-2 text-gray-400" />
                  <span className="font-medium">Name:</span>
                  <span className="ml-2">{payment.properties.landlord.name}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-3 w-3 mr-2 text-gray-400" />
                  <span className="font-medium">Email:</span>
                  <span className="ml-2">{payment.properties.landlord.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-3 w-3 mr-2 text-gray-400" />
                  <span className="font-medium">Phone:</span>
                  <span className="ml-2">{payment.properties.landlord.phone}</span>
                </div>
                <div className="flex items-start">
                  <Home className="h-3 w-3 mr-2 mt-0.5 text-gray-400" />
                  <span className="font-medium">Address:</span>
                  <span className="ml-2">{payment.properties.landlord.address}</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 pt-2">
                Landlord ID: {payment.properties.landlord.id.slice(0, 8)}...
              </div>
            </div>
          )}

          <div className="bg-white/60 p-4 rounded-lg border border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Due Date
                </p>
                <p className="font-medium">
                  {new Date(payment.due_date).toLocaleDateString()}
                </p>
              </div>
              {isPaid && (
                <div>
                  <p className="text-gray-500 flex items-center">
                    <CreditCard className="h-3 w-3 mr-1" />
                    Payment Method
                  </p>
                  <p className="font-medium capitalize">
                    {payment.payment_method?.replace('_', ' ') || 'N/A'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {!isPaid && (
            <div className="pt-2 flex space-x-2">
              <Button 
                onClick={handlePayRent}
                disabled={isProcessing}
                className={`flex-1 ${isOverdue ? 'bg-red-600 hover:bg-red-700' : ''}`}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {isProcessing ? 'Processing...' : isOverdue ? 'Pay Overdue Rent' : 'Pay Rent'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RentPaymentCard;
