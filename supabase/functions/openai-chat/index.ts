
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

    const { prompt, model = "gpt-4o-mini", isVariation = false } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log(`Processing prompt with model ${model}: ${prompt.substring(0, 50)}...`);
    
    const timestamp = new Date().toISOString();

    // Updated system prompt to format keywords into proper sentences
    const systemPrompt = `
You are a creative interior design assistant. 
Your task is to create a STARTING POINT suggestion based on the keywords provided.
Keep in mind this is only a suggestion - users will edit and refine this prompt themselves in the main prompt box.

FORMAT REQUIREMENTS:
1. Start with 'Imagine' and create 1-2 complete sentences (30-40 words total).
2. Convert the comma-separated keywords into a coherent, grammatically correct description.
3. Use proper punctuation with commas and end with a period.
4. Make sure your description is specific and focused on the design elements mentioned.
`;

    // Call OpenAI API
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
        max_tokens: 90,
        temperature: 0.9
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
        model: model
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
