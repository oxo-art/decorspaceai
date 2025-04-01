
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface ReplicateRequest {
  prompt: string;
  image?: string;
  model?: "imageToImage" | "interiorDesign" | "denoise";
  guidance_scale?: number;
  negative_prompt?: string;
  prompt_strength?: number;
  num_inference_steps?: number;
  scale?: number;
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
  negative_prompt = "lowresolution, text, watermark, banner, logo, watermark, contactinfo, text, deformed, blurry, blur, out of focus, out of frame, surreal, extra, ugly, upholstered walls, fabric walls, plush walls, mirror, mirrored, functional",
  prompt_strength = model === "interiorDesign" ? 0.8 : 1,
  num_inference_steps = model === "interiorDesign" ? 50 : 100,
  scale = 4
}: ReplicateRequest): Promise<ReplicateResponse> => {
  if (!image && model !== "denoise") {
    throw new Error("Image is required");
  }

  if (!prompt && model !== "denoise") {
    throw new Error("Prompt is required");
  }

  try {
    console.log("Starting image transformation with model:", model);
    console.log("Parameters:", { 
      prompt, 
      guidance_scale, 
      prompt_strength, 
      num_inference_steps,
      scale
    });
    
    const { data, error } = await supabase.functions.invoke("replicate-proxy", {
      body: {
        model,
        prompt,
        image,
        guidance_scale,
        negative_prompt,
        prompt_strength,
        num_inference_steps,
        scale
      }
    });
    
    if (error) {
      console.error("Error calling Edge Function:", error);
      throw new Error(error.message || "Failed to transform image");
    }
    
    console.log("Edge Function response:", data);
    
    let outputUrl = null;
    if (data.output) {
      outputUrl = Array.isArray(data.output) ? data.output[0] : data.output;
    }
    
    return {
      id: data.id || "edge-function-run",
      status: data.status || "success",
      output: outputUrl,
      error: data.error || null
    };
  } catch (error) {
    console.error("Error transforming image:", error);
    
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
