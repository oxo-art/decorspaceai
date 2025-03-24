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

    const { model, prompt, image, guidance_scale, negative_prompt, prompt_strength, num_inference_steps, scale, face_enhance } = await req.json()
    
    // Determine which model to use
    if (model === "upscale") {
      console.log("Using Real-ESRGAN upscaling model")
      
      // Create prediction with the Real-ESRGAN model
      const response = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${REPLICATE_API_KEY}`,
        },
        body: JSON.stringify({
          version: "f94d7ed4a1f7e1ffed0d51e4089e4911609d5eeee5e874ef323d2c7562624bed",
          input: {
            image: image,
            scale: scale || 4,
            face_enhance: face_enhance || true
          }
        }),
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
      console.log("Upscaling prediction created:", prediction.id)
      
      // Poll for results
      let attempts = 0
      const maxAttempts = 60 
      
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
        console.log(`Upscaling prediction status: ${status.status}`)
        
        if (status.status === "succeeded") {
          console.log("Upscaling succeeded, output:", status.output)
          return new Response(
            JSON.stringify({
              id: status.id,
              status: status.status,
              output: status.output,
              error: null,
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } else if (status.status === "failed") {
          console.error("Upscaling prediction failed:", status.error)
          return new Response(
            JSON.stringify({
              id: status.id,
              status: status.status,
              output: null,
              error: status.error || "Upscaling prediction failed",
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          )
        }
        
        // Wait before checking again
        await new Promise(resolve => setTimeout(resolve, 2000))
        attempts++
      }
      
      return new Response(
        JSON.stringify({
          id: prediction.id,
          status: "timeout",
          output: null,
          error: "Upscaling prediction timed out",
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 504 }
      )
    } else if (model === "interiorDesign") {
      console.log("Using interior design model with parameters:", { prompt, guidance_scale, negative_prompt, prompt_strength, num_inference_steps })
      
      // Create prediction with the proper URL format and parameters
      const response = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${REPLICATE_API_KEY}`,
        },
        body: JSON.stringify({
          version: "76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38",
          input: {
            image: image,
            prompt: prompt,
            guidance_scale: guidance_scale || 15,
            negative_prompt: negative_prompt || "lowres, watermark, banner, logo, watermark, contactinfo, text, deformed, blurry, blur, out of focus, out of frame, surreal, extra, ugly, upholstered walls, fabric walls, plush walls, mirror, mirrored, functional, realistic",
            prompt_strength: prompt_strength || 0.8,
            num_inference_steps: num_inference_steps || 50
          }
        }),
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
      const maxAttempts = 60 // Increased max attempts for longer generation
      
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
          console.log("Prediction succeeded, output:", status.output)
          return new Response(
            JSON.stringify({
              id: status.id,
              status: status.status,
              output: status.output,
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
        await new Promise(resolve => setTimeout(resolve, 2000)) // Increased wait time
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
    } else {
      // Default image-to-image model
      const response = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${REPLICATE_API_KEY}`,
        },
        body: JSON.stringify({
          version: "37a94e2ee35c267ee9e1e6435bd867fec5d46dbb7b3528a9f2fd3d53dc5bdc9e",
          input: {
            image: image,
            prompt: prompt,
          },
        }),
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
    }
    
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
