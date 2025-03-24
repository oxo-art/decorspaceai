
import { corsHeaders, waitForPrediction } from "./utils.ts";

export const handleUpscaleModel = async (image: string, scale = 4, face_enhance = true, apiKey: string) => {
  console.log("Using Real-ESRGAN upscaling model");
  
  // Create prediction with the Real-ESRGAN model
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${apiKey}`,
    },
    body: JSON.stringify({
      version: "f94d7ed4a1f7e1ffed0d51e4089e4911609d5eeee5e874ef323d2c7562624bed",
      input: {
        image: image,
        scale: scale,
        face_enhance: face_enhance
      }
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Replicate API error for upscale:", error);
    throw new Error(error.detail || "Failed to start upscaling");
  }

  const prediction = await response.json();
  console.log("Upscaling prediction created:", prediction.id);
  
  try {
    const result = await waitForPrediction(prediction.id, apiKey, 60, "Upscaling");
    return result;
  } catch (error) {
    console.error("Error during upscaling:", error);
    throw error;
  }
};
