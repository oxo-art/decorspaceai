
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface OpenAIRequest {
  prompt: string;
  model?: string;
  isVariation?: boolean;
}

interface OpenAIResponse {
  result: string;
  model: string;
  error?: string;
}

/**
 * Calls the OpenAI API through a Supabase Edge Function
 */
export const getAIDesignSuggestion = async ({
  prompt,
  model = "gpt-4o-mini",
  isVariation = false
}: OpenAIRequest): Promise<OpenAIResponse> => {
  try {
    console.log("Requesting AI design suggestion");
    
    const { data, error } = await supabase.functions.invoke("openai-chat", {
      body: {
        prompt,
        model,
        isVariation
      }
    });
    
    if (error) {
      console.error("Error calling Edge Function:", error);
      toast.error("Failed to get AI suggestions");
      throw new Error(error.message || "Failed to get AI suggestions");
    }
    
    console.log("AI response received:", data);
    
    return {
      result: data.result,
      model: data.model
    };
  } catch (error) {
    console.error("Error getting AI design suggestion:", error);
    
    const errorMessage = error.message || "Failed to get AI design suggestions. Please try again later.";
    
    toast.error(errorMessage);
    
    return {
      result: "",
      model: "",
      error: errorMessage
    };
  }
};
