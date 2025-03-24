
import { toast } from "sonner";

export interface ReplicateRequest {
  prompt: string;
  image?: string;
}

export interface ReplicateResponse {
  id: string;
  status: string;
  output: string | null;
  error: string | null;
}

// This value should be provided by an environment variable in your deployment
// For local development, you would need to set this in your environment
const REPLICATE_API_KEY = import.meta.env.VITE_REPLICATE_API_KEY || "";

/**
 * Calls the Replicate API to transform an image based on a prompt
 */
export const transformImage = async ({
  prompt, 
  image
}: ReplicateRequest): Promise<ReplicateResponse> => {
  if (!image) {
    throw new Error("Image is required");
  }

  if (!prompt) {
    throw new Error("Prompt is required");
  }

  if (!REPLICATE_API_KEY) {
    toast.error("Replicate API key is not configured");
    throw new Error("Replicate API key is not configured");
  }

  try {
    // Create a prediction with Replicate's API
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${REPLICATE_API_KEY}`,
      },
      body: JSON.stringify({
        version: "37a94e2ee35c267ee9e1e6435bd867fec5d46dbb7b3528a9f2fd3d53dc5bdc9e",
        input: {
          image: image,
          prompt: prompt,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Error calling Replicate API");
    }

    const prediction = await response.json();
    
    // Poll for results
    const result = await checkPredictionStatus(prediction.id);
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
const checkPredictionStatus = async (id: string): Promise<ReplicateResponse> => {
  const maxAttempts = 30;
  let attempts = 0;

  return new Promise((resolve, reject) => {
    const checkStatus = async () => {
      try {
        const response = await fetch(
          `https://api.replicate.com/v1/predictions/${id}`,
          {
            headers: {
              Authorization: `Token ${REPLICATE_API_KEY}`,
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
