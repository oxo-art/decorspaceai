
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

// This is where we get the API key from the environment variables
// For local development with Vite, use import.meta.env.VITE_REPLICATE_API_KEY
// For production, ensure this is set in your hosting environment
const REPLICATE_API_KEY = import.meta.env.VITE_REPLICATE_API_KEY || "";

/**
 * Calls the Replicate API to transform an image based on a prompt
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

  // Check if API key is available
  const apiKey = REPLICATE_API_KEY || localStorage.getItem("REPLICATE_API_KEY");
  
  if (!apiKey) {
    // Instead of using the browser's prompt, we'll throw an error that will be handled in the UI
    toast.error("Replicate API key is required. Please set it in the application.");
    throw new Error("REPLICATE_API_KEY_REQUIRED");
  }

  const effectiveApiKey = apiKey;

  try {
    // Determine which model to use
    let modelVersion;
    let requestBody;

    if (model === "interiorDesign") {
      // Interior design model
      modelVersion = "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38";
      requestBody = {
        version: modelVersion,
        input: {
          image: image,
          prompt: prompt,
          guidance_scale,
          negative_prompt,
          prompt_strength,
          num_inference_steps
        },
      };
    } else {
      // Default image-to-image model
      modelVersion = "37a94e2ee35c267ee9e1e6435bd867fec5d46dbb7b3528a9f2fd3d53dc5bdc9e";
      requestBody = {
        version: modelVersion,
        input: {
          image: image,
          prompt: prompt,
        },
      };
    }

    // Create a prediction with Replicate's API
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${effectiveApiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Error calling Replicate API");
    }

    const prediction = await response.json();
    
    // Poll for results
    const result = await checkPredictionStatus(prediction.id, effectiveApiKey);
    return result;
  } catch (error) {
    console.error("Error transforming image:", error);
    toast.error(error.message || "Failed to transform image");
    throw error;
  }
};

/**
 * Polls the Replicate API for a prediction's status until it completes
 */
const checkPredictionStatus = async (id: string, apiKey: string): Promise<ReplicateResponse> => {
  const maxAttempts = 30;
  let attempts = 0;

  return new Promise((resolve, reject) => {
    const checkStatus = async () => {
      try {
        const response = await fetch(
          `https://api.replicate.com/v1/predictions/${id}`,
          {
            headers: {
              Authorization: `Token ${apiKey}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.detail || "Error checking prediction status");
        }

        const prediction = await response.json();
        
        if (prediction.status === "succeeded") {
          resolve({
            id: prediction.id,
            status: prediction.status,
            output: prediction.output && prediction.output[0],
            error: null,
          });
        } else if (prediction.status === "failed") {
          reject({
            id: prediction.id,
            status: prediction.status,
            output: null,
            error: prediction.error || "Prediction failed",
          });
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(checkStatus, 1000);
        } else {
          reject({
            id: prediction.id,
            status: "timeout",
            output: null,
            error: "Prediction timed out",
          });
        }
      } catch (error) {
        reject({
          id: id,
          status: "error",
          output: null,
          error: error.message || "Error checking prediction",
        });
      }
    };

    checkStatus();
  });
};
