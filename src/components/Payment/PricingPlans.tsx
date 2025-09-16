import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Crown, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PricingPlan {
  id: string;
  name: string;
  credits: number;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
}

const plans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    credits: 10,
    price: 99,
    description: 'Perfect for trying out AI interior design',
    features: [
      '10 AI design generations',
      'High-quality outputs',
      'Multiple style options',
      'Download in JPG format',
    ],
    icon: <Zap className="h-6 w-6" />,
  },
  {
    id: 'popular',
    name: 'Popular Pack',
    credits: 50,
    price: 399,
    originalPrice: 495,
    description: 'Most popular choice for home owners',
    features: [
      '50 AI design generations',
      'Premium quality outputs',
      'All style categories',
      'Priority processing',
      'Email support',
    ],
    popular: true,
    icon: <Star className="h-6 w-6" />,
  },
  {
    id: 'professional',
    name: 'Professional Pack',
    credits: 150,
    price: 999,
    originalPrice: 1485,
    description: 'For interior designers and professionals',
    features: [
      '150 AI design generations',
      'Ultra-high quality outputs',
      'Custom style training',
      'Bulk processing',
      'Priority support',
      'Commercial usage rights',
    ],
    icon: <Crown className="h-6 w-6" />,
  },
];

interface PricingPlansProps {
  onPlanSelect?: (plan: PricingPlan) => void;
}

export default function PricingPlans({ onPlanSelect }: PricingPlansProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePurchase = async (plan: PricingPlan) => {
    try {
      setLoading(plan.id);

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
        customer_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        customer_email: user.email || '',
        customer_phone: user.user_metadata?.phone || '9999999999',
      };

      // Create payment order
      const { data: orderData, error: orderError } = await supabase.functions.invoke('create-payment-order', {
        body: {
          amount: plan.price,
          currency: 'INR',
          customer_details: customerDetails,
          credits_to_purchase: plan.credits,
        },
      });

      if (orderError) {
        throw new Error(orderError.message);
      }

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create payment order');
      }

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
              title: "Payment Successful!",
              description: `You have successfully purchased ${plan.credits} credits.`,
            });
            
            // Verify payment on our backend
            supabase.functions.invoke('verify-payment', {
              body: { order_id: orderData.order_id },
            });
          }
        });
      };
      
      document.head.appendChild(script);

      if (onPlanSelect) {
        onPlanSelect(plan);
      }

    } catch (error: any) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Choose Your Credits Package
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Get started with AI interior design. Each credit generates one unique design.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3 lg:gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4 text-primary">
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {plan.description}
                </CardDescription>
                
                <div className="mt-4">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl font-bold text-foreground">₹{plan.price}</span>
                    {plan.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through">
                        ₹{plan.originalPrice}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {plan.credits} credits • ₹{Math.round(plan.price / plan.credits)} per credit
                  </p>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full" 
                  size="lg"
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => handlePurchase(plan)}
                  disabled={loading === plan.id}
                >
                  {loading === plan.id ? 'Processing...' : `Get ${plan.credits} Credits`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Secure payment powered by Cashfree • All prices in INR • Credits never expire
          </p>
        </div>
      </div>
    </div>
  );
}