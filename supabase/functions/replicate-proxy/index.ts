
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"
import { corsHeaders, handleCorsPreflightRequest, createErrorResponse, resizeBase64Image } from "./utils.ts"
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

    const { model, prompt, image, guidance_scale, negative_prompt, prompt_strength, num_inference_steps, scale, face_enhance } = await req.json()
    
    try {
      let result;
      let processedImage = image;
      
      // If we're using the denoise model and there's an image, resize it if needed
      if (model === "denoise" && image) {
        try {
          processedImage = await resizeBase64Image(image, 1024); // Limit to 1024px on the longest side
        } catch (resizeError) {
          console.error("Error resizing image:", resizeError);
          // Continue with the original image if resize fails
        }
      }
      
      // Determine which model to use
      if (model === "interiorDesign") {
        result = await handleInteriorDesignModel(
          processedImage, 
          prompt, 
          guidance_scale, 
          negative_prompt, 
          prompt_strength, 
          num_inference_steps, 
          REPLICATE_API_KEY
        );
      } else if (model === "denoise") {
        result = await handleDenoiseModel(
          processedImage,
          scale || 4, // Set default to 4x upscaling
          REPLICATE_API_KEY,
          face_enhance || false
        );
      } else {
        result = await handleDefaultModel(processedImage, prompt, REPLICATE_API_KEY);
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
