
import { corsHeaders, waitForPrediction } from "./utils.ts";

export const handleDenoiseModel = async (
  image: string,
  scale: number = 2,
  apiKey: string
) => {
  console.log("Using denoising model with parameters:", { scale });
  
  // Create prediction with the proper URL format and parameters
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${apiKey}`,
    },
    body: JSON.stringify({
      version: "c8c34a15a22e407f70e08feb45c28fe010d8bc92e5cfea6e47ce5b44d4c1a7b6", // Updated Real-ESRGAN model version
      input: {
        image: image,
        scale: 2,  // Lowering scale to more conservative value
        face_enhance: true,
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
