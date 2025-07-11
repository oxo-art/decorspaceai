
import { corsHeaders, waitForPrediction } from "./utils.ts";

export const handleDenoiseModel = async (
  image: string,
  scale: number = 2,
  apiKey: string
) => {
  console.log("Using denoising model with parameters:", { scale });
  
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
      version: "42fed1c4974146d4d2414e2be2c5277c7fcba946c7871be8f5b6fac3b965195a", // Real-ESRGAN model
      input: {
        image: image,
        scale: safeScale,
        face_enhance: true,
        tile: 0, // Auto tile size
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
