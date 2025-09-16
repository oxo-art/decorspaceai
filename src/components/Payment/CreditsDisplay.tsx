import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Coins, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserCredits {
  credits: number;
  total_purchased: number;
}

interface CreditsDisplayProps {
  onBuyCredits?: () => void;
  refreshTrigger?: number;
}

export default function CreditsDisplay({ onBuyCredits, refreshTrigger }: CreditsDisplayProps) {
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCredits = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        setCredits(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_credits')
        .select('credits, total_purchased')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching credits:', error);
        toast({
          title: "Error",
          description: "Failed to fetch your credits balance.",
          variant: "destructive",
        });
        return;
      }

      setCredits(data || { credits: 0, total_purchased: 0 });
    } catch (error) {
      console.error('Error fetching credits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, [refreshTrigger]);

  // Set up real-time subscription for credits updates
  useEffect(() => {
    const channel = supabase
      .channel('user_credits_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_credits',
        },
        () => {
          fetchCredits();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <Card className="w-full max-w-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-muted rounded animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const creditsCount = credits?.credits || 0;
  const totalPurchased = credits?.total_purchased || 0;

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Coins className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">{creditsCount}</span>
                <span className="text-sm text-muted-foreground">credits</span>
                {creditsCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    Available
                  </Badge>
                )}
              </div>
              {totalPurchased > 0 && (
                <p className="text-xs text-muted-foreground">
                  {totalPurchased} purchased total
                </p>
              )}
            </div>
          </div>
          
          {onBuyCredits && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={onBuyCredits}
              className="gap-1"
            >
              <Plus className="h-3 w-3" />
              Buy
            </Button>
          )}
        </div>
        
        {creditsCount === 0 && (
          <div className="mt-3 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              No credits available. Purchase credits to generate AI designs.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}