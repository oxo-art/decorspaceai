
import { corsHeaders, waitForPrediction } from "./utils.ts";

export const handleDefaultModel = async (image: string, prompt: string, apiKey: string) => {
  // Default image-to-image model
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${apiKey}`,
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
    console.error("Replicate API error for default model:", error);
    throw new Error(error.detail || "Failed to start image transformation");
  }

  const prediction = await response.json();
  console.log("Default model prediction created:", prediction.id);
  
  try {
    const result = await waitForPrediction(prediction.id, apiKey, 30, "Default model");
    // The default model returns an array as output, but we want to return just the first item
    if (result.output && Array.isArray(result.output)) {
      result.output = result.output[0];
    }
    return result;
  } catch (error) {
    console.error("Error during default model transformation:", error);
    throw error;
  }
};
