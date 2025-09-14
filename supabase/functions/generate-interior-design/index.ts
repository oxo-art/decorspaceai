import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Replicate from "https://esm.sh/replicate@0.25.2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const REPLICATE_API_KEY = Deno.env.get('REPLICATE_API_KEY')
    if (!REPLICATE_API_KEY) {
      throw new Error('REPLICATE_API_KEY is not set')
    }

    const replicate = new Replicate({
      auth: REPLICATE_API_KEY,
    })

    const body = await req.json()
    console.log("Request body:", body)

    // Validate required fields
    if (!body.prompt) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required field: prompt is required" 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    if (!body.imageInput || !Array.isArray(body.imageInput) || body.imageInput.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required field: imageInput is required and must be a non-empty array" 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    console.log("Generating interior design with prompt:", body.prompt)
    console.log("Image inputs:", body.imageInput)

    // Use first image from the array
    const imageData = Array.isArray(body.imageInput) ? body.imageInput[0] : null

    // Generate using a reliable image-editing model on Replicate
    // timbrooks/instruct-pix2pix takes an input image and a text instruction (prompt)
    const output = await replicate.run(
      "timbrooks/instruct-pix2pix",
      {
        input: {
          prompt: body.prompt,
          image: imageData,
          guidance_scale: 7.5,
          image_guidance_scale: 1.5,
          num_inference_steps: 30
        }
      }
    )

    console.log("Generation response:", output)

    // Replicate typically returns an array of image URLs
    const imageUrl = Array.isArray(output)
      ? (output[0] || null)
      : (typeof output === 'string' ? output : null)

    if (!imageUrl) {
      return new Response(JSON.stringify({ 
        success: false,
        error: "Failed to get image URL from model output",
        output
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 502,
      })
    }

    return new Response(JSON.stringify({ 
      success: true,
      imageUrl,
      output
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error("Error in generate-interior-design function:", error)
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})