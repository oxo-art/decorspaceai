import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface ImageGenerationRequest {
  prompt: string;
  image?: string;
}

export interface ImageGenerationResponse {
  id: string;
  status: string;
  output: string | null;
  error: string | null;
}

/**
 * Generate an image using OpenAI DALL-E through Supabase Edge Function
 */
export const generateImage = async ({
  prompt,
  image
}: ImageGenerationRequest): Promise<ImageGenerationResponse> => {
  if (!prompt) {
    throw new Error("Prompt is required");
  }

  try {
    console.log("Starting image generation with OpenAI DALL-E");
    
    const { data, error } = await supabase.functions.invoke("openai-image-generation", {
      body: {
        prompt,
        image
      }
    });
    
    if (error) {
      console.error("Error calling OpenAI Edge Function:", error);
      throw new Error(error.message || "Failed to generate image");
    }
    
    console.log("OpenAI Edge Function response:", data);
    
    return {
      id: "openai-generation",
      status: data.success ? "success" : "error",
      output: data.imageUrl || null,
      error: data.error || null
    };
  } catch (error) {
    console.error("Error generating image:", error);
    
    const errorMessage = error.message || "Failed to generate image. Please try again later.";
    toast.error(errorMessage);
    
    return {
      id: "error",
      status: "error",
      output: null,
      error: errorMessage
    };
  }
};

export interface AIDesignSuggestionRequest {
  prompt: string;
  isVariation?: boolean;
}

export interface AIDesignSuggestionResponse {
  result?: string;
  error?: string;
}

/**
 * Get AI design suggestion for interior design prompts
 */
export const getAIDesignSuggestion = async ({
  prompt,
  isVariation = false
}: AIDesignSuggestionRequest): Promise<AIDesignSuggestionResponse> => {
  if (!prompt) {
    throw new Error("Prompt is required");
  }

  try {
    console.log("Getting AI design suggestion");
    
    const { data, error } = await supabase.functions.invoke("openai-chat", {
      body: {
        messages: [{
          role: "user",
          content: `Generate a detailed interior design prompt based on these keywords: ${prompt}. ${isVariation ? 'Create a different variation from previous suggestions.' : ''} Focus on specific design elements, colors, furniture, and atmosphere.`
        }]
      }
    });
    
    if (error) {
      console.error("Error calling OpenAI Chat Edge Function:", error);
      return { error: error.message || "Failed to get design suggestion" };
    }
    
    return {
      result: data.content || data.message || "No suggestion generated"
    };
  } catch (error) {
    console.error("Error getting AI design suggestion:", error);
    return {
      error: error.message || "Failed to get design suggestion. Please try again later."
    };
  }
};