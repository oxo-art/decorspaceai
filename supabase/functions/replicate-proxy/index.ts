
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"
import { corsHeaders, handleCorsPreflightRequest, createErrorResponse } from "./utils.ts"
import { handleInteriorDesignModel } from "./interiorDesignModel.ts"
import { handleDefaultModel } from "./defaultModel.ts"
import { handleDenoiseModel } from "./denoiseModel.ts"

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest();
  }

  try {
    const REPLICATE_API_KEY = Deno.env.get('REPLICATE_API_KEY')
    
    if (!REPLICATE_API_KEY) {
      return createErrorResponse('API key not configured on server');
    }

    const { model, prompt, image, guidance_scale, negative_prompt, prompt_strength, num_inference_steps, scale } = await req.json()
    
    try {
      let result;
      
      // Determine which model to use
      if (model === "interiorDesign") {
        result = await handleInteriorDesignModel(
          image, 
          prompt, 
          guidance_scale, 
          negative_prompt, 
          prompt_strength, 
          num_inference_steps, 
          REPLICATE_API_KEY
        );
      } else if (model === "denoise") {
        result = await handleDenoiseModel(
          image,
          scale || 2,
          REPLICATE_API_KEY
        );
      } else {
        result = await handleDefaultModel(image, prompt, REPLICATE_API_KEY);
      }
      
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('Model processing error:', error);
      return new Response(
        JSON.stringify({
          id: "error",
          status: "error",
          output: null,
          error: error.message || "Model processing failed",
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
  } catch (error) {
    console.error('General error:', error);
    return new Response(
      JSON.stringify({ 
        detail: error.message || 'Internal server error',
        status: 'error'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
})
