
import { corsHeaders, waitForPrediction, resizeBase64Image } from "./utils.ts";

export const handleDenoiseModel = async (
  image: string,
  scale: number = 4,
  apiKey: string,
  face_enhance: boolean = true
) => {
  console.log("Using upscaler model with parameters:", { scale, face_enhance });
  
  // Make sure scale is between 2-4, as higher values might cause errors
  const safeScale = Math.min(Math.max(scale, 2), 4);
  
  try {
    // Always resize the image to prevent memory issues
    // Even if it was already processed in index.ts, do it here as well for safety
    const resizedImage = await resizeBase64Image(image, 1024);
    console.log("Image resized for upscaling to prevent memory issues");
    
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
          image: resizedImage,
          scale: safeScale,
          face_enhance: face_enhance
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
  } catch (error) {
    console.error("Error preprocessing image or during upscaling:", error);
    throw new Error(`Upscaling failed: ${error.message || "Unknown error"}`);
  }
};
