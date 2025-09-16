import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateOrderRequest {
  amount: number;
  currency?: string;
  customer_details: {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
  };
  credits_to_purchase: number;
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

    const body: CreateOrderRequest = await req.json();
    console.log('Creating payment order for user:', user.id, 'Amount:', body.amount);

    // Validate required fields
    if (!body.amount || !body.customer_details || !body.credits_to_purchase) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate unique order ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Prepare Cashfree order payload
    const orderPayload = {
      order_id: orderId,
      order_amount: body.amount,
      order_currency: body.currency || 'INR',
      customer_details: body.customer_details,
      order_meta: {
        return_url: `${req.headers.get('origin')}/payment-success?order_id={order_id}`,
        notify_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/payment-webhook`,
      },
    };

    console.log('Cashfree order payload:', orderPayload);

    // Get Cashfree credentials from environment
    const clientId = Deno.env.get('CASHFREE_CLIENT_ID');
    const clientSecret = Deno.env.get('CASHFREE_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      throw new Error('Cashfree credentials not configured');
    }

    // Create order with Cashfree API
    const cashfreeResponse = await fetch('https://sandbox.cashfree.com/pg/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': clientId,
        'x-client-secret': clientSecret,
        'x-api-version': '2023-08-01',
      },
      body: JSON.stringify(orderPayload),
    });

    const cashfreeData = await cashfreeResponse.json();
    console.log('Cashfree API response:', cashfreeData);

    if (!cashfreeResponse.ok) {
      throw new Error(`Cashfree API error: ${JSON.stringify(cashfreeData)}`);
    }

    // Store payment record in database
    const { error: dbError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        cashfree_order_id: orderId,
        amount: body.amount,
        currency: body.currency || 'INR',
        status: 'pending',
        metadata: {
          credits_to_purchase: body.credits_to_purchase,
          customer_details: body.customer_details,
        },
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to store payment record');
    }

    return new Response(JSON.stringify({
      success: true,
      order_id: orderId,
      payment_session_id: cashfreeData.payment_session_id,
      order_details: cashfreeData,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error('Error creating payment order:', error);
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