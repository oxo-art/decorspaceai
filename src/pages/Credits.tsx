import { useEffect } from 'react';
import Navbar from '@/components/Home/Navbar';
import PricingPlans from '@/components/Payment/PricingPlans';
import CreditsDisplay from '@/components/Payment/CreditsDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History, CreditCard, Zap } from 'lucide-react';

export default function Credits() {
  useEffect(() => {
    document.title = 'Credits & Pricing - AI Interior Design Tool';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Purchase credits for AI interior design generation. Affordable pricing plans for home owners and professionals.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        {/* Header Section */}
        <section className="py-12 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground sm:text-5xl">
                Credits & Pricing
              </h1>
              <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
                Transform your space with AI-powered interior design. Each credit generates one unique, professional-quality design.
              </p>
            </div>
            
            {/* Current Credits Display */}
            <div className="mt-8 flex justify-center">
              <CreditsDisplay />
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section>
          <PricingPlans />
        </section>

        {/* Features Section */}
        <section className="py-12 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground">
                Why Choose Our AI Interior Design?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Professional-quality results powered by advanced AI technology
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Instant Generation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Get professional interior design concepts in seconds. No waiting, no delays.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Affordable Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Start from just ₹10 per design. Much more affordable than hiring a professional designer.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <History className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>No Expiry</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your credits never expire. Use them whenever you want to redesign your space.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  How do credits work?
                </h3>
                <p className="text-muted-foreground">
                  Each credit allows you to generate one AI interior design. Simply upload a photo of your room, 
                  describe your desired style, and use one credit to get a professional design concept.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Do credits expire?
                </h3>
                <p className="text-muted-foreground">
                  No, your credits never expire. You can use them whenever you want to redesign your space 
                  or try different design styles.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-muted-foreground">
                  We accept all major credit cards, debit cards, UPI, net banking, and digital wallets 
                  through our secure payment partner Cashfree.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Can I get a refund if I'm not satisfied?
                </h3>
                <p className="text-muted-foreground">
                  We offer a satisfaction guarantee. If you're not happy with your generated designs, 
                  contact our support team within 7 days for a full refund.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}