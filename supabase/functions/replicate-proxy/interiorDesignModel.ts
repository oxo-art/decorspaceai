
import { corsHeaders, waitForPrediction } from "./utils.ts";

export const handleInteriorDesignModel = async (
  image: string, 
  prompt: string, 
  guidance_scale = 15,
  negative_prompt = "",
  prompt_strength = 0.8, 
  num_inference_steps = 50,
  apiKey: string
) => {
  console.log("Using interior design model with parameters:", { prompt, guidance_scale, prompt_strength, num_inference_steps });
  
  // Create prediction with the proper URL format and parameters
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${apiKey}`,
    },
    body: JSON.stringify({
      version: "854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b", // Updated interior design model version
      input: {
        image: image,
        prompt: prompt,
        guidance_scale: guidance_scale,
        negative_prompt: negative_prompt,
        prompt_strength: prompt_strength,
        num_inference_steps: num_inference_steps
      }
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Replicate API error for interior design:", error);
    throw new Error(error.detail || "Failed to start interior design transformation");
  }

  const prediction = await response.json();
  console.log("Interior design prediction created:", prediction.id);
  
  try {
    const result = await waitForPrediction(prediction.id, apiKey, 60, "Interior design");
    return result;
  } catch (error) {
    console.error("Error during interior design transformation:", error);
    throw error;
  }
};
