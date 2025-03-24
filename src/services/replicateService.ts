
import { toast } from "sonner";

export interface ReplicateRequest {
  prompt: string;
  image?: string;
  model?: "imageToImage" | "interiorDesign";
  guidance_scale?: number;
  negative_prompt?: string;
  prompt_strength?: number;
  num_inference_steps?: number;
}

export interface ReplicateResponse {
  id: string;
  status: string;
  output: string | null;
  error: string | null;
}

/**
 * Calls the Replicate API to transform an image based on a prompt
 */
export const transformImage = async ({
  prompt, 
  image,
  model = "interiorDesign",
  guidance_scale = 15,
  negative_prompt = "lowres, watermark, banner, logo, watermark, contactinfo, text, deformed, blurry, blur, out of focus, out of frame, surreal, extra, ugly, upholstered walls, fabric walls, plush walls, mirror, mirrored, functional, realistic",
  prompt_strength = model === "interiorDesign" ? 0.8 : 1,
  num_inference_steps = model === "interiorDesign" ? 50 : 100
}: ReplicateRequest): Promise<ReplicateResponse> => {
  if (!image) {
    throw new Error("Image is required");
  }

  if (!prompt) {
    throw new Error("Prompt is required");
  }

  try {
    // Get the API token from environment variable
    const apiToken = import.meta.env.VITE_REPLICATE_API_TOKEN;
    
    if (!apiToken) {
      throw new Error("Replicate API token is not configured. Please set the VITE_REPLICATE_API_TOKEN environment variable.");
    }
    
    console.log("Starting image transformation with model:", model);
    console.log("Parameters:", { prompt, guidance_scale, prompt_strength, num_inference_steps });
    
    // Define the request body based on the model type
    const requestBody = {
      version: "76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38",
      input: {
        image: image,
        prompt: prompt,
        guidance_scale,
        negative_prompt,
        prompt_strength,
        num_inference_steps
      }
    };
    
    // Call the Replicate API directly with the "wait" preference
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiToken}`,
        "Content-Type": "application/json",
        "Prefer": "wait" // This tells the API to wait for the prediction to complete
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to transform image");
    }
    
    const result = await response.json();
    console.log("API response:", result);
    
    // Extract the output from the response
    let outputUrl = null;
    if (result.output && Array.isArray(result.output) && result.output.length > 0) {
      outputUrl = result.output[0];
    }
    
    // Return the response in the expected format
    return {
      id: result.id || "replicate-run",
      status: result.status || "success",
      output: outputUrl,
      error: null
    };
  } catch (error) {
    console.error("Error transforming image:", error);
    
    // More user-friendly error message
    const errorMessage = error.message || "Failed to transform image. Please try again later.";
    
    toast.error(errorMessage);
    
    return {
      id: "error",
      status: "error",
      output: null,
      error: errorMessage
    };
  }
};
