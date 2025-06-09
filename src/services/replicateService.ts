
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface ReplicateRequest {
  prompt: string;
  image?: string;
  model?: "interiorDesign";
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
 * Calls the Replicate API through a Supabase Edge Function to transform an image using adirik/interior-design model
 */
export const transformImage = async ({
  prompt, 
  image,
  model = "interiorDesign",
  guidance_scale = 15,
  negative_prompt = "lowresolution, text, watermark, banner, logo, watermark, contactinfo, text, deformed, blurry, blur, out of focus, out of frame, surreal, extra, ugly, upholstered walls, fabric walls, plush walls, mirror, mirrored, functional, noise, double furniture, extra items, distorted proportions, unrealistic layout, incorrect perspective, overlapping furniture, additional doors, additional windows, unwanted elements, inconsistent lighting, strange colors, unasked additions, fantasy elements, oversized furniture, undersized furniture, ignoring prompt instructions",
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
    console.log("Starting image transformation with adirik/interior-design model");
    
    // Process and validate image data
    const processedImage = processImageForAPI(image);
    console.log("Image processed successfully");
    
    console.log("Parameters:", { 
      prompt: prompt.substring(0, 50) + "...", 
      guidance_scale, 
      prompt_strength, 
      num_inference_steps,
      hasImage: !!processedImage
    });
    
    const { data, error } = await supabase.functions.invoke("replicate-proxy", {
      body: {
        model: "interiorDesign",
        prompt,
        image: processedImage,
        guidance_scale,
        negative_prompt,
        prompt_strength,
        num_inference_steps
      }
    });
    
    if (error) {
      console.error("Error calling Replicate Edge Function:", error);
      throw new Error(error.message || "Failed to transform image with adirik/interior-design model");
    }
    
    console.log("Replicate Edge Function response:", data);
    
    let outputUrl = null;
    if (data.output) {
      outputUrl = Array.isArray(data.output) ? data.output[0] : data.output;
    }
    
    return {
      id: data.id || "replicate-run",
      status: data.status || "success",
      output: outputUrl,
      error: data.error || null
    };
  } catch (error) {
    console.error("Error transforming image with adirik model:", error);
    
    const errorMessage = error.message || "Failed to transform image with adirik/interior-design model. Please try again later.";
    toast.error(errorMessage);
    
    return {
      id: "error",
      status: "error",
      output: null,
      error: errorMessage
    };
  }
};
