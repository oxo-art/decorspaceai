import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json();
    console.log('Received Cashfree webhook:', body);

    // Extract payment information from webhook
    const { 
      order_id, 
      payment_id,
      payment_status,
      payment_method,
      payment_amount,
      payment_currency 
    } = body.data || body;

    if (!order_id) {
      console.error('Missing order_id in webhook payload');
      return new Response(JSON.stringify({ error: 'Missing order_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Processing webhook for order: ${order_id}, status: ${payment_status}`);

    // Find the payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('cashfree_order_id', order_id)
      .single();

    if (paymentError || !payment) {
      console.error('Payment record not found for order:', order_id);
      return new Response(JSON.stringify({ error: 'Payment record not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update payment status
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: payment_status?.toLowerCase() || 'unknown',
        cashfree_payment_id: payment_id,
        payment_method: payment_method,
      })
      .eq('id', payment.id);

    if (updateError) {
      console.error('Failed to update payment status:', updateError);
      return new Response(JSON.stringify({ error: 'Failed to update payment' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // If payment is successful, add credits to user account
    if (payment_status?.toLowerCase() === 'success' && payment.metadata?.credits_to_purchase) {
      const creditsToAdd = payment.metadata.credits_to_purchase as number;
      
      console.log(`Payment successful, adding ${creditsToAdd} credits to user ${payment.user_id}`);
      
      // Get current user credits
      const { data: currentCredits, error: getCreditsError } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', payment.user_id)
        .single();

      if (getCreditsError && getCreditsError.code !== 'PGRST116') {
        console.error('Error fetching current credits:', getCreditsError);
      }

      // Calculate new credit amounts
      const newCredits = (currentCredits?.credits || 0) + creditsToAdd;
      const newTotalPurchased = (currentCredits?.total_purchased || 0) + creditsToAdd;

      // Upsert user credits
      const { error: creditsError } = await supabase
        .from('user_credits')
        .upsert({
          user_id: payment.user_id,
          credits: newCredits,
          total_purchased: newTotalPurchased,
        }, {
          onConflict: 'user_id',
        });

      if (creditsError) {
        console.error('Failed to update user credits:', creditsError);
      } else {
        console.log(`Successfully added ${creditsToAdd} credits to user ${payment.user_id}. New total: ${newCredits}`);
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Webhook processed successfully' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
};

serve(handler);