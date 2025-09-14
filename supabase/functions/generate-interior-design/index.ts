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

    console.log("Generating interior design with Google Nano Banana")

    // Generate using Google Nano Banana model with correct schema
    const output = await replicate.run(
      "google/nano-banana",
      {
        input: {
          prompt: body.prompt,
          image_input: body.imageInput,
          output_format: "jpg"
        }
      }
    )

    console.log("Generation response:", output)

    // Google Nano Banana returns an object with .url() method
    let imageUrl = null
    
    try {
      if (output && typeof output.url === 'function') {
        imageUrl = output.url()
      } else if (typeof output === 'string') {
        imageUrl = output
      } else if (Array.isArray(output) && output.length > 0) {
        imageUrl = output[0]
      } else if (output && output.url) {
        imageUrl = output.url
      }
    } catch (urlError) {
      console.error("Error extracting URL:", urlError)
    }

    if (!imageUrl) {
      return new Response(JSON.stringify({ 
        success: false,
        error: "Failed to get image URL from Google Nano Banana output",
        output: typeof output
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 502,
      })
    }

    return new Response(JSON.stringify({ 
      success: true,
      imageUrl,
      output: typeof output
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