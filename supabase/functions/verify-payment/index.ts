import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerifyPaymentRequest {
  order_id: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get user from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid user token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body: VerifyPaymentRequest = await req.json();
    console.log('Verifying payment for user:', user.id, 'Order ID:', body.order_id);

    if (!body.order_id) {
      return new Response(JSON.stringify({ error: 'Missing order_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get Cashfree credentials
    const clientId = Deno.env.get('CASHFREE_CLIENT_ID');
    const clientSecret = Deno.env.get('CASHFREE_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      throw new Error('Cashfree credentials not configured');
    }

    // Check payment status with Cashfree API
    const cashfreeResponse = await fetch(`https://sandbox-api.cashfree.com/pg/orders/${body.order_id}/payments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': clientId,
        'x-client-secret': clientSecret,
        'x-api-version': '2023-08-01',
      },
    });

    const cashfreeData = await cashfreeResponse.json();
    console.log('Cashfree payment status:', cashfreeData);

    if (!cashfreeResponse.ok) {
      throw new Error(`Cashfree API error: ${JSON.stringify(cashfreeData)}`);
    }

    // Get payment record from database
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('cashfree_order_id', body.order_id)
      .eq('user_id', user.id)
      .single();

    if (paymentError || !payment) {
      return new Response(JSON.stringify({ error: 'Payment record not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extract payment details from Cashfree response
    const payments = cashfreeData;
    let paymentStatus = 'pending';
    let paymentId = null;
    let paymentMethod = null;

    if (payments && payments.length > 0) {
      const latestPayment = payments[0];
      paymentStatus = latestPayment.payment_status?.toLowerCase() || 'pending';
      paymentId = latestPayment.cf_payment_id;
      paymentMethod = latestPayment.payment_method;
    }

    // Update payment record
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: paymentStatus,
        cashfree_payment_id: paymentId,
        payment_method: paymentMethod,
      })
      .eq('id', payment.id);

    if (updateError) {
      console.error('Failed to update payment:', updateError);
    }

    // If payment is successful, add credits to user account
    if (paymentStatus === 'success' && payment.metadata?.credits_to_purchase) {
      const creditsToAdd = payment.metadata.credits_to_purchase as number;
      
      // Upsert user credits
      const { error: creditsError } = await supabase
        .from('user_credits')
        .upsert({
          user_id: user.id,
          credits: creditsToAdd,
          total_purchased: creditsToAdd,
        }, {
          onConflict: 'user_id',
          ignoreDuplicates: false,
        });

      if (creditsError) {
        console.error('Failed to update user credits:', creditsError);
        // Still return success for payment verification
      } else {
        console.log(`Added ${creditsToAdd} credits to user ${user.id}`);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      payment_status: paymentStatus,
      payment_details: {
        order_id: body.order_id,
        payment_id: paymentId,
        payment_method: paymentMethod,
        amount: payment.amount,
        currency: payment.currency,
      },
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error('Error verifying payment:', error);
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