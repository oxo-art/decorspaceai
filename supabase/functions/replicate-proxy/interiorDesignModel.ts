
import { corsHeaders, waitForPrediction } from "./utils.ts";

export const handleInteriorDesignModel = async (
  image: string, 
  prompt: string, 
  guidance_scale = 15,
  negative_prompt = "",
  prompt_strength = 1, 
  num_inference_steps = 100,
  apiKey: string
) => {
  console.log("Using adirik/interior-design model with parameters:", { prompt, guidance_scale, prompt_strength, num_inference_steps });
  
  // Enhanced prompt formatting to ensure absolute focus on the user's description
  const enhancedPrompt = `TOP PRIORITY DESIGN INSTRUCTION: ${prompt}. Transform this interior space according to these exact specifications while preserving the basic structure. Follow these requirements precisely and exclusively.`;
  
  // Create prediction with the adirik/interior-design model
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${apiKey}`,
    },
    body: JSON.stringify({
      version: "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38",
      input: {
        image: image,
        prompt: enhancedPrompt,
        guidance_scale: guidance_scale,
        negative_prompt: negative_prompt,
        prompt_strength: prompt_strength,
        num_inference_steps: num_inference_steps
      }
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Replicate API error for adirik/interior-design model:", error);
    throw new Error(error.detail || "Failed to start adirik/interior-design transformation");
  }

  const prediction = await response.json();
  console.log("Adirik/interior-design prediction created:", prediction.id);
  
  try {
    const result = await waitForPrediction(prediction.id, apiKey, 60, "Adirik interior design");
    return result;
  } catch (error) {
    console.error("Error during adirik/interior-design transformation:", error);
    throw error;
  }
};
