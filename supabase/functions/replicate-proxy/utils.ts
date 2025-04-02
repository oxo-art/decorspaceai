
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const handleCorsPreflightRequest = () => {
  return new Response(null, {
    headers: {
      ...corsHeaders,
    },
  });
};

export const createErrorResponse = (message: string, status = 400) => {
  return new Response(
    JSON.stringify({
      error: message,
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status,
    }
  );
};

export const waitForPrediction = async (
  id: string,
  apiKey: string,
  maxAttempts = 60,
  modelType = "Default"
) => {
  let attempts = 0;
  const checkInterval = 2000; // 2 seconds
  
  console.log(`${modelType} prediction ${id}: Starting status check loop`);
  
  while (attempts < maxAttempts) {
    attempts++;
    
    console.log(`${modelType} prediction ${id}: Checking status, attempt ${attempts}/${maxAttempts}`);
    
    const response = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`${modelType} prediction ${id}: Error checking status:`, errorData);
      throw new Error(`Failed to check prediction status: ${errorData.detail || 'Unknown error'}`);
    }
    
    const prediction = await response.json();
    console.log(`${modelType} prediction ${id}: Current status: ${prediction.status}`);
    
    if (prediction.status === "succeeded") {
      console.log(`${modelType} prediction ${id}: Completed successfully`);
      return prediction;
    } else if (prediction.status === "failed") {
      console.error(`${modelType} prediction ${id}: Failed`, prediction.error);
      throw new Error(`${modelType} process failed: ${prediction.error || 'Unknown error'}`);
    } else if (prediction.status === "canceled") {
      console.error(`${modelType} prediction ${id}: Canceled`);
      throw new Error(`${modelType} process was canceled`);
    }
    
    // Sleep for the specified interval before checking again
    await new Promise(resolve => setTimeout(resolve, checkInterval));
  }
  
  console.error(`${modelType} prediction ${id}: Timed out after ${maxAttempts} attempts`);
  throw new Error(`${modelType} process timed out after ${maxAttempts * (checkInterval / 1000)} seconds`);
};

// Add a new utility function to resize large base64 images
export const resizeBase64Image = async (base64Str: string, maxDimension: number = 1024): Promise<string> => {
  try {
    // Get the image data without the prefix
    const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 string format');
    }
    
    const contentType = matches[1];
    const base64Data = matches[2];
    const byteArray = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    // Create an image in memory
    const response = new Response(byteArray.buffer);
    const blob = await response.blob();
    
    // Create an image element and set the blob as its source
    const img = new Image();
    const imageBitmapPromise = createImageBitmap(blob);
    
    const imageBitmap = await imageBitmapPromise;
    
    // Calculate the new dimensions
    let newWidth, newHeight;
    if (imageBitmap.width > imageBitmap.height) {
      if (imageBitmap.width > maxDimension) {
        newWidth = maxDimension;
        newHeight = (imageBitmap.height / imageBitmap.width) * maxDimension;
      } else {
        newWidth = imageBitmap.width;
        newHeight = imageBitmap.height;
      }
    } else {
      if (imageBitmap.height > maxDimension) {
        newHeight = maxDimension;
        newWidth = (imageBitmap.width / imageBitmap.height) * maxDimension;
      } else {
        newWidth = imageBitmap.width;
        newHeight = imageBitmap.height;
      }
    }
    
    // Create a canvas with the new dimensions
    const canvas = new OffscreenCanvas(newWidth, newHeight);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    
    // Draw the image on the canvas
    ctx.drawImage(imageBitmap, 0, 0, newWidth, newHeight);
    
    // Get the resized image as a blob
    const resizedBlob = await canvas.convertToBlob({ type: contentType });
    
    // Convert the blob back to base64
    const arrayBuffer = await resizedBlob.arrayBuffer();
    const resizedBase64 = `data:${contentType};base64,${btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))}`;
    
    console.log(`Image resized from ${imageBitmap.width}x${imageBitmap.height} to ${newWidth}x${newHeight}`);
    
    return resizedBase64;
  } catch (error) {
    console.error('Error resizing image:', error);
    // Return the original image if resizing fails
    return base64Str;
  }
};
