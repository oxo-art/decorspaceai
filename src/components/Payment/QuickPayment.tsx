import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Zap, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function QuickPayment() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleQuickPayment = async () => {
    try {
      setLoading(true);

      // Check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to purchase credits.",
          variant: "destructive",
        });
        return;
      }

      // Get user details for payment
      const customerDetails = {
        customer_id: user.id, // Add required customer_id field
        customer_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        customer_email: user.email || '',
        customer_phone: user.user_metadata?.phone || '9999999999',
      };

      // Create payment order for ₹50 = 5 credits
      const { data: orderData, error: orderError } = await supabase.functions.invoke('create-payment-order', {
        body: {
          amount: 50,
          currency: 'INR',
          customer_details: customerDetails,
          credits_to_purchase: 5,
        },
      });

      if (orderError) {
        throw new Error(orderError.message);
      }

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create payment order');
      }

      console.log('Payment order created:', orderData);

      // Load Cashfree SDK and open payment modal
      const script = document.createElement('script');
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
      script.onload = () => {
        const cashfree = (window as any).Cashfree({
          mode: 'sandbox', // Change to 'production' for live
        });

        cashfree.checkout({
          paymentSessionId: orderData.payment_session_id,
          redirectTarget: '_modal',
        }).then((result: any) => {
          if (result.error) {
            console.error('Payment error:', result.error);
            toast({
              title: "Payment Failed",
              description: result.error.message || "Payment could not be completed.",
              variant: "destructive",
            });
          }
          if (result.redirect) {
            console.log('Redirection');
          }
          if (result.paymentDetails) {
            console.log('Payment completed:', result.paymentDetails);
            toast({
              title: "Payment Successful! 🎉",
              description: "You have successfully purchased 5 credits for ₹50.",
            });
            
            // Verify payment on our backend
            supabase.functions.invoke('verify-payment', {
              body: { order_id: orderData.order_id },
            });
          }
        }).catch((error: any) => {
          console.error('Cashfree checkout error:', error);
          toast({
            title: "Payment Error",
            description: "There was an error opening the payment modal.",
            variant: "destructive",
          });
        });
      };

      script.onerror = () => {
        toast({
          title: "Payment Error",
          description: "Failed to load payment system. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      };
      
      document.head.appendChild(script);

    } catch (error: any) {
      console.error('Quick payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mt-16 mb-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-volkhov text-foreground font-bold mb-4">
          Try AI Design for Just ₹50
        </h2>
        <p className="text-lg text-muted-foreground">
          Get 5 credits and transform your space with professional AI interior design
        </p>
      </div>

      <Card className="glass-card hover:shadow-glass-hover transition-all duration-300 max-w-lg mx-auto">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <CreditCard className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Quick Start Pack</CardTitle>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-3xl font-bold text-primary">₹50</span>
            <span className="text-lg text-muted-foreground">for 5 credits</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-sm text-foreground">5 AI design generations</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-sm text-foreground">High-quality outputs</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-sm text-foreground">Instant results</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-sm text-foreground">Credits never expire</span>
            </div>
          </div>

          {user ? (
            <Button 
              onClick={handleQuickPayment}
              disabled={loading}
              className="w-full glass-button hover:shadow-glow-lg transition-all duration-300 py-6 text-lg font-medium"
              size="lg"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Pay ₹50 & Start Designing
                </div>
              )}
            </Button>
          ) : (
            <Button asChild className="w-full glass-button hover:shadow-glow-lg transition-all duration-300 py-6 text-lg font-medium" size="lg">
              <Link to="/auth">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Sign In to Purchase
                </div>
              </Link>
            </Button>
          )}

          <p className="text-xs text-center text-muted-foreground">
            Secure payment powered by Cashfree • Instant credit delivery
          </p>
        </CardContent>
      </Card>
    </div>
  );
}