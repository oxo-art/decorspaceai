
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

const processImageForAPI = (imageDataUrl: string): string => {
  try {
    // Ensure we have a valid data URL
    if (!imageDataUrl || !imageDataUrl.startsWith('data:')) {
      throw new Error('Invalid image data URL');
    }
    
    // Extract the base64 part and validate it
    const base64Data = imageDataUrl.split(',')[1];
    if (!base64Data || base64Data.length < 100) {
      throw new Error('Invalid base64 image data');
    }
    
    console.log('Processed image data length:', base64Data.length);
    return imageDataUrl;
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error('Failed to process image data');
  }
};

/**
 * Fallback to OpenAI image generation when Replicate fails
 */
const fallbackToOpenAI = async (prompt: string): Promise<ReplicateResponse> => {
  try {
    console.log("Falling back to OpenAI image generation");
    
    const { data, error } = await supabase.functions.invoke("openai-image-generation", {
      body: {
        prompt: `Interior design: ${prompt}`,
        model: "dall-e-3",
        size: "1024x1024",
        quality: "standard"
      }
    });
    
    if (error) {
      throw new Error(error.message || "OpenAI fallback failed");
    }
    
    console.log("OpenAI fallback successful");
    
    return {
      id: data.id || "openai-fallback",
      status: "success",
      output: data.output || data.image,
      error: null
    };
  } catch (error) {
    console.error("OpenAI fallback error:", error);
    throw error;
  }
};

/**
 * Calls the Replicate API through a Supabase Edge Function to transform an image based on a prompt
 */
export const transformImage = async ({
  prompt, 
  image,
  model = "interiorDesign",
  guidance_scale = 15,
  negative_prompt = "lowresolution, text, watermark, banner, logo, watermark, contactinfo, text, deformed, blurry, blur, out of focus, out of frame, surreal, extra, ugly, upholstered walls, fabric walls, plush walls, mirror, mirrored, functional, noise, double furniture, extra items, distorted proportions, unrealistic layout, incorrect perspective, overlapping furniture, additional doors, additional windows, unwanted elements, inconsistent lighting, strange colors, unasked additions, fantasy elements, oversized furniture, undersized furniture, ignoring prompt instructions",
  prompt_strength = 1,
  num_inference_steps = 100,
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
    
    // Process and validate image data
    let processedImage = null;
    if (image) {
      processedImage = processImageForAPI(image);
      console.log("Image processed successfully");
    }
    
    console.log("Parameters:", { 
      prompt: prompt.substring(0, 50) + "...", 
      guidance_scale, 
      prompt_strength, 
      num_inference_steps,
      scale,
      hasImage: !!processedImage
    });
    
    const { data, error } = await supabase.functions.invoke("replicate-proxy", {
      body: {
        model,
        prompt,
        image: processedImage,
        guidance_scale,
        negative_prompt,
        prompt_strength,
        num_inference_steps,
        scale
      }
    });
    
    // Check for specific Replicate API errors that indicate spend limit
    if (error && (
      error.message?.includes("spend limit") || 
      error.message?.includes("Monthly spend limit") ||
      error.message?.includes("402") ||
      data?.error?.includes("spend limit")
    )) {
      console.log("Replicate spend limit reached, trying OpenAI fallback");
      toast.info("Using alternative AI service for image generation...");
      return await fallbackToOpenAI(prompt);
    }
    
    if (error) {
      console.error("Error calling Edge Function:", error);
      // Try OpenAI fallback for any Replicate error
      console.log("Replicate failed, trying OpenAI fallback");
      toast.info("Primary service unavailable, using backup AI service...");
      return await fallbackToOpenAI(prompt);
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
    
    // If primary service fails, try OpenAI fallback
    if (!error.message?.includes("OpenAI")) {
      try {
        console.log("Primary service failed, trying OpenAI fallback");
        toast.info("Switching to backup AI service...");
        return await fallbackToOpenAI(prompt);
      } catch (fallbackError) {
        console.error("All services failed:", fallbackError);
        const errorMessage = "All AI services are currently unavailable. Please try again later.";
        toast.error(errorMessage);
        
        return {
          id: "error",
          status: "error",
          output: null,
          error: errorMessage
        };
      }
    }
    
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
