
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const REPLICATE_API_KEY = Deno.env.get('REPLICATE_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!REPLICATE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Replicate API key not configured" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    const { prompt, image } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log(`Generating image with Adirik interior design model: ${prompt.substring(0, 50)}...`);

    // Use Adirik interior design model via Replicate
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${REPLICATE_API_KEY}`,
      },
      body: JSON.stringify({
        version: "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38",
        input: {
          image: image,
          prompt: prompt,
          guidance_scale: 15,
          prompt_strength: 1,
          num_inference_steps: 100
        }
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Adirik model API error:", error);
      return new Response(
        JSON.stringify({ error: error.detail || "Error calling Adirik interior design model" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    const prediction = await response.json();
    console.log("Adirik prediction created:", prediction.id);

    // Wait for prediction to complete
    let attempts = 0;
    const maxAttempts = 60;
    
    while (attempts < maxAttempts) {
      const statusResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        {
          headers: {
            Authorization: `Token ${REPLICATE_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (!statusResponse.ok) {
        const error = await statusResponse.json();
        console.error("Status check error:", error);
        throw new Error(`Failed to check prediction status: ${error.detail || 'Unknown error'}`);
      }
      
      const status = await statusResponse.json();
      console.log("Adirik prediction status:", status.status);
      
      if (status.status === "succeeded") {
        console.log("Adirik prediction succeeded, output:", status.output);
        
        let outputUrl = null;
        if (status.output) {
          outputUrl = Array.isArray(status.output) ? status.output[0] : status.output;
        }
        
        return new Response(
          JSON.stringify({
            id: status.id,
            status: "success",
            output: outputUrl,
            image: outputUrl
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } else if (status.status === "failed") {
        console.error("Adirik prediction failed:", status.error);
        throw new Error(status.error || "Adirik prediction failed");
      }
      
      // Wait before checking again
      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;
    }
    
    throw new Error("Adirik prediction timed out");

  } catch (error) {
    console.error("Error processing Adirik interior design generation:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
