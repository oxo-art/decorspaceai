
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
      version: "f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa", // nightmareai/real-esrgan model
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
