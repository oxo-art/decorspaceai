
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const handleCorsPreflightRequest = () => {
  return new Response(null, { headers: corsHeaders });
};

export const createErrorResponse = (message: string, status = 500) => {
  return new Response(
    JSON.stringify({ detail: message }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status }
  );
};

export const waitForPrediction = async (predictionId: string, apiKey: string, maxAttempts = 40, modelType: string) => {
  let attempts = 0;
  
  // Set polling interval to 1.5 seconds instead of 2
  const pollingInterval = 1500;
  
  while (attempts < maxAttempts) {
    const statusResponse = await fetch(
      `https://api.replicate.com/v1/predictions/${predictionId}`,
      {
        headers: {
          Authorization: `Token ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    
    if (!statusResponse.ok) {
      const error = await statusResponse.json();
      console.error(`Status check error for ${modelType}:`, error);
      throw new Error(`Failed to check prediction status: ${error.detail || 'Unknown error'}`);
    }
    
    const status = await statusResponse.json();
    console.log(`${modelType} prediction status: ${status.status}`);
    
    if (status.status === "succeeded") {
      console.log(`${modelType} succeeded, output:`, status.output);
      return {
        id: status.id,
        status: status.status,
        output: status.output,
        error: null,
      };
    } else if (status.status === "failed") {
      console.error(`${modelType} prediction failed:`, status.error);
      throw new Error(status.error || `${modelType} prediction failed`);
    }
    
    // Wait before checking again with reduced interval
    await new Promise(resolve => setTimeout(resolve, pollingInterval));
    attempts++;
  }
  
  throw new Error(`${modelType} prediction timed out`);
};
