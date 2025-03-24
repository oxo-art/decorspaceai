
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
 * Calls the Replicate API through our secure proxy to transform an image based on a prompt
 */
export const transformImage = async ({
  prompt, 
  image,
  model = "imageToImage",
  guidance_scale = 15,
  negative_prompt = "lowres, watermark, banner, logo, watermark, contactinfo, text, deformed, blurry, blur, out of focus, out of frame, surreal, extra, ugly, upholstered walls, fabric walls, plush walls, mirror, mirrored, functional, realistic",
  prompt_strength = 1,
  num_inference_steps = 100
}: ReplicateRequest): Promise<ReplicateResponse> => {
  if (!image) {
    throw new Error("Image is required");
  }

  if (!prompt) {
    throw new Error("Prompt is required");
  }

  try {
    // Create a request body with all the needed parameters
    const requestBody = {
      prompt,
      image,
      model,
      guidance_scale,
      negative_prompt,
      prompt_strength,
      num_inference_steps
    };

    // Call our proxy endpoint instead of Replicate directly
    const response = await fetch("/api/replicate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Error calling API");
    }

    // Our proxy will already poll and wait for the result
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error transforming image:", error);
    toast.error(error.message || "Failed to transform image");
    throw error;
  }
};
