
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
  model = "interiorDesign", // Change default to interiorDesign
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
      // Handle non-200 responses properly
      const errorText = await response.text();
      let errorDetail;
      try {
        // Try to parse as JSON, but don't fail if it's not valid JSON
        errorDetail = JSON.parse(errorText);
      } catch (e) {
        // If it's not valid JSON, use the raw text
        errorDetail = { detail: errorText || "Error calling API" };
      }
      throw new Error(errorDetail.detail || "Error calling API");
    }

    // Safely handle response parsing
    let responseText = await response.text();
    let result;
    
    // Only try to parse if there's actual content
    if (responseText && responseText.trim()) {
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse response:", responseText);
        throw new Error("Invalid response from server");
      }
    } else {
      throw new Error("Empty response from server");
    }

    return result;
  } catch (error) {
    console.error("Error transforming image:", error);
    toast.error(error.message || "Failed to transform image");
    throw error;
  }
};
