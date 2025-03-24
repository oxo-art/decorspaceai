
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface ReplicateRequest {
  prompt: string;
  image?: string;
  model?: "imageToImage" | "interiorDesign" | "upscale";
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
 * Calls the Replicate API through a Supabase Edge Function to transform an image based on a prompt
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

  if (!prompt && model !== "upscale") {
    throw new Error("Prompt is required");
  }

  try {
    console.log("Starting image transformation with model:", model);
    console.log("Parameters:", { prompt, guidance_scale, prompt_strength, num_inference_steps });
    
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke("replicate-proxy", {
      body: {
        model,
        prompt,
        image,
        guidance_scale,
        negative_prompt,
        prompt_strength,
        num_inference_steps
      }
    });
    
    if (error) {
      console.error("Error calling Edge Function:", error);
      throw new Error(error.message || "Failed to transform image");
    }
    
    console.log("Edge Function response:", data);
    
    // Extract the output URL from the response
    // The interior design model returns the output as the first element of the output array
    let outputUrl = null;
    if (data.output) {
      outputUrl = Array.isArray(data.output) ? data.output[0] : data.output;
    }
    
    // Return the response in the expected format
    return {
      id: data.id || "edge-function-run",
      status: data.status || "success",
      output: outputUrl,
      error: data.error || null
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

/**
 * Upscales an image using Replicate's upscaling model
 * Note: This is a placeholder for future implementation
 */
export const upscaleImage = async (imageUrl: string): Promise<ReplicateResponse> => {
  // This is a placeholder function that currently just returns the original image
  // In a real implementation, this would call a different Replicate model for upscaling
  return {
    id: "upscale-placeholder",
    status: "success",
    output: imageUrl,
    error: null
  };
};
