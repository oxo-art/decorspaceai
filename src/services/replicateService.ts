
import { toast } from "sonner";
import Replicate from "replicate";

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
    // Get API key from environment variable
    const apiKey = import.meta.env.VITE_REPLICATE_API_KEY;
    
    if (!apiKey) {
      // Instead of throwing an error, show a more user-friendly message
      toast.error("Replicate API key is not configured. Please set the VITE_REPLICATE_API_KEY environment variable.");
      return {
        id: "error",
        status: "error",
        output: null,
        error: "API key not configured"
      };
    }
    
    // Initialize the Replicate client
    const replicate = new Replicate({
      auth: apiKey,
    });
    
    // Run the model
    const output = await replicate.run(
      "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38",
      {
        input: {
          image: image,
          prompt: prompt,
          guidance_scale: guidance_scale,
          negative_prompt: negative_prompt,
          prompt_strength: prompt_strength,
          num_inference_steps: num_inference_steps
        }
      }
    );
    
    // Return the response in the expected format
    return {
      id: "replicate-run",
      status: "success",
      output: output && Array.isArray(output) && output.length > 0 ? output[0] : null,
      error: null
    };
  } catch (error) {
    console.error("Error transforming image:", error);
    
    // More user-friendly error message
    const errorMessage = error.message?.includes("API key") 
      ? "Invalid or missing API key. Please check your API key configuration."
      : "Failed to transform image. Please try again later.";
    
    toast.error(errorMessage);
    
    return {
      id: "error",
      status: "error",
      output: null,
      error: errorMessage
    };
  }
};
