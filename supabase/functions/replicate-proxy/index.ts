
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const REPLICATE_API_KEY = Deno.env.get('REPLICATE_API_KEY')
    
    if (!REPLICATE_API_KEY) {
      return new Response(
        JSON.stringify({ detail: 'API key not configured on server' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const { model, prompt, image, ...otherParams } = await req.json()
    
    // Determine which model to use
    let modelVersion
    let requestBody

    if (model === "interiorDesign") {
      // Interior design model
      modelVersion = "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38"
      requestBody = {
        version: modelVersion,
        input: {
          image: image,
          prompt: prompt,
          ...otherParams
        },
      }
    } else {
      // Default image-to-image model
      modelVersion = "37a94e2ee35c267ee9e1e6435bd867fec5d46dbb7b3528a9f2fd3d53dc5bdc9e"
      requestBody = {
        version: modelVersion,
        input: {
          image: image,
          prompt: prompt,
        },
      }
    }

    console.log(`Using Replicate model: ${modelVersion}`)
    console.log("Request parameters:", { prompt, ...otherParams })

    // Create prediction
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${REPLICATE_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("Replicate API error:", error)
      return new Response(
        JSON.stringify(error),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: response.status }
      )
    }

    const prediction = await response.json()
    console.log("Prediction created:", prediction.id)
    
    // Poll for results
    let attempts = 0
    const maxAttempts = 30
    
    while (attempts < maxAttempts) {
      const statusResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        {
          headers: {
            Authorization: `Token ${REPLICATE_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      )
      
      if (!statusResponse.ok) {
        const error = await statusResponse.json()
        console.error("Status check error:", error)
        return new Response(
          JSON.stringify(error),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: statusResponse.status }
        )
      }
      
      const status = await statusResponse.json()
      console.log(`Prediction status: ${status.status}`)
      
      if (status.status === "succeeded") {
        console.log("Prediction succeeded:", status.output)
        return new Response(
          JSON.stringify({
            id: status.id,
            status: status.status,
            output: status.output && status.output[0],
            error: null,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } else if (status.status === "failed") {
        console.error("Prediction failed:", status.error)
        return new Response(
          JSON.stringify({
            id: status.id,
            status: status.status,
            output: null,
            error: status.error || "Prediction failed",
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }
      
      // Wait before checking again
      await new Promise(resolve => setTimeout(resolve, 1000))
      attempts++
    }
    
    return new Response(
      JSON.stringify({
        id: prediction.id,
        status: "timeout",
        output: null,
        error: "Prediction timed out",
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 504 }
    )
    
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        detail: error.message || 'Internal server error',
        status: 'error'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
