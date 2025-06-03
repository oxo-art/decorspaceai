
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface OpenAIRequest {
  prompt: string;
  model?: string;
  isVariation?: boolean;
  isImageGeneration?: boolean;
  inputImages?: string[];
}

interface OpenAIResponse {
  result: string;
  model: string;
  type?: string;
  error?: string;
}

/**
 * Converts image file to base64 string
 */
const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix to get just the base64 string
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Calls the OpenAI API through a Supabase Edge Function
 */
export const getAIDesignSuggestion = async ({
  prompt,
  model = "gpt-4o-mini",
  isVariation = false,
  isImageGeneration = false,
  inputImages = []
}: OpenAIRequest): Promise<OpenAIResponse> => {
  try {
    console.log("Requesting AI design suggestion", { isImageGeneration });
    
    const { data, error } = await supabase.functions.invoke("openai-chat", {
      body: {
        prompt,
        model,
        isVariation,
        isImageGeneration,
        inputImages
      }
    });
    
    if (error) {
      console.error("Error calling Edge Function:", error);
      const errorMessage = isImageGeneration ? "Failed to generate image" : "Failed to get AI suggestions";
      toast.error(errorMessage);
      throw new Error(error.message || errorMessage);
    }
    
    console.log("AI response received:", data);
    
    return {
      result: data.result,
      model: data.model,
      type: data.type
    };
  } catch (error) {
    console.error("Error getting AI design suggestion:", error);
    
    const errorMessage = error.message || (isImageGeneration ? "Failed to generate image. Please try again later." : "Failed to get AI design suggestions. Please try again later.");
    
    toast.error(errorMessage);
    
    return {
      result: "",
      model: "",
      error: errorMessage
    };
  }
};

/**
 * Generate an image using OpenAI's new image generation API with optional input images
 */
export const generateImageWithOpenAI = async (prompt: string, inputImages?: string[]): Promise<OpenAIResponse> => {
  return getAIDesignSuggestion({
    prompt,
    isImageGeneration: true,
    inputImages
  });
};

export { convertImageToBase64 };
