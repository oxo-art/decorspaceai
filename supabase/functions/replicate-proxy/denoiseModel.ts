
import { corsHeaders, waitForPrediction } from "./utils.ts";

export const handleDenoiseModel = async (
  image: string,
  scale: number = 2,
  apiKey: string,
  face_enhance: boolean = false
) => {
  console.log("Using denoising model with parameters:", { scale, face_enhance });
  
  // Make sure scale is between 2-4, as higher values might cause errors
  const safeScale = Math.min(Math.max(scale, 2), 4);
  
  // Create prediction with the proper URL format and parameters
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${apiKey}`,
    },
    body: JSON.stringify({
      version: "42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b", // Updated version ID for Real-ESRGAN
      input: {
        image: image,
        scale: safeScale,
        face_enhance: face_enhance,
      }
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Replicate API error for denoising:", error);
    throw new Error(error.detail || "Failed to start denoising process");
  }

  const prediction = await response.json();
  console.log("Denoising prediction created:", prediction.id);
  
  try {
    const result = await waitForPrediction(prediction.id, apiKey, 60, "Denoising");
    return result;
  } catch (error) {
    console.error("Error during denoising process:", error);
    throw error;
  }
};
