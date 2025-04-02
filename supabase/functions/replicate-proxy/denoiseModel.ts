
import { corsHeaders, waitForPrediction } from "./utils.ts";

export const handleDenoiseModel = async (
  image: string,
  scale: number = 2,
  apiKey: string,
  face_enhance: boolean = false
) => {
  console.log("Using upscaler model with parameters:", { scale, face_enhance });
  
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
      version: "4f7eb3da655b5182e559d50a0437440f242992d47e5e20bd82829a79dee61ff3", // alexgenovese/upscaler model ID
      input: {
        image: image,
        scale: safeScale,
        face_enhance: face_enhance,
      }
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Replicate API error for upscaling:", error);
    throw new Error(error.detail || "Failed to start upscaling process");
  }

  const prediction = await response.json();
  console.log("Upscaling prediction created:", prediction.id);
  
  try {
    const result = await waitForPrediction(prediction.id, apiKey, 60, "Upscaling");
    return result;
  } catch (error) {
    console.error("Error during upscaling process:", error);
    throw error;
  }
};
