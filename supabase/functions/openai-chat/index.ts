
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    const { prompt, model = "gpt-4o-mini", isVariation = false, isImageGeneration = false } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log(`Processing request with model ${model}: ${prompt.substring(0, 50)}...`);
    
    // Handle image generation requests using DALL-E 3
    if (isImageGeneration) {
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
          quality: "standard"
        })
      });

      const data = await response.json();

      if (data.error) {
        console.error("OpenAI API error:", data.error);
        return new Response(
          JSON.stringify({ error: data.error.message || "Error calling OpenAI API" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }

      // Extract the image URL from the response
      if (data.data && data.data.length > 0) {
        const imageUrl = data.data[0].url;
        return new Response(
          JSON.stringify({
            result: imageUrl,
            model: "dall-e-3",
            type: "image"
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } else {
        return new Response(
          JSON.stringify({ error: "No image generated" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
    }

    // Handle text generation requests (existing functionality)
    const timestamp = new Date().toISOString();

    // Enhanced system prompt for better grammar, sentence structure, and punctuation
    const systemPrompt = `
You are a creative interior design assistant creating detailed, grammatically correct prompt suggestions.

OBJECTIVE:
Transform comma-separated keywords into an elegant, detailed description for interior design image generation.

FORMAT REQUIREMENTS:
1. Start with "Imagine" and create 1-2 complete, grammatically perfect sentences (30-40 words total).
2. Incorporate ALL keywords naturally into fluid, sophisticated prose.
3. Use proper punctuation throughout - commas for phrasing, semicolons for complex structures, and end with a period.
4. Create vivid mental imagery focusing specifically on the design elements mentioned.
5. Maintain consistent tense and perspective throughout the description.

EXAMPLES:
- Keywords: "modern, minimalist, white walls, plants"
  Good: "Imagine a modern, minimalist space with pristine white walls, strategically adorned with lush green plants that bring life to every corner."
- Keywords: "rustic, wooden beams, fireplace, cozy"
  Good: "Imagine a rustic retreat featuring exposed wooden beams that frame a stone fireplace; the warm, cozy atmosphere invites relaxation with soft textures and amber lighting."
`;

    // Call OpenAI API for text completion
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `Create a starting point suggestion with these keywords: ${prompt} (Timestamp: ${timestamp})`
          }
        ],
        max_tokens: 100,
        temperature: 0.8
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("OpenAI API error:", data.error);
      return new Response(
        JSON.stringify({ error: data.error.message || "Error calling OpenAI API" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        result: data.choices[0].message.content,
        model: model,
        type: "text"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
