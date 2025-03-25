
import React, { useRef, useEffect } from 'react';

interface ImageProcessorProps {
  inputImageUrl: string | null;
  onProcessed: (enhancedImageUrl: string) => void;
}

const ImageProcessor: React.FC<ImageProcessorProps> = ({ inputImageUrl, onProcessed }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const enhanceImage = async (imageUrl: string): Promise<string> => {
    // Load original image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    await new Promise((resolve) => {
      img.onload = resolve;
    });
    
    // Set up canvas
    const canvas = canvasRef.current;
    if (!canvas) return imageUrl;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return imageUrl;
    
    // Change upscaling factor from 7x to 5x
    const scaleFactor = 5;
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Clear canvas completely
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // High quality settings
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Draw original image to canvas
    ctx.drawImage(img, 0, 0, img.width, img.height);
    
    // Get the original pixel data for denoising
    const originalData = ctx.getImageData(0, 0, img.width, img.height);
    const pixels = originalData.data;
    
    // Apply more aggressive denoising - median filter simulation
    // Create a copy of the image data for processing
    const processedData = new ImageData(
      new Uint8ClampedArray(pixels), 
      originalData.width, 
      originalData.height
    );
    const processedPixels = processedData.data;
    
    // Apply multiple passes of smoothing for stronger denoising
    for (let pass = 0; pass < 3; pass++) {
      // Apply a simple box blur for denoising
      for (let y = 1; y < img.height - 1; y++) {
        for (let x = 1; x < img.width - 1; x++) {
          for (let c = 0; c < 3; c++) { // Only process RGB channels, not alpha
            const idx = (y * img.width + x) * 4 + c;
            
            // Get surrounding pixels (3x3 kernel)
            const neighbors = [
              pixels[(y-1) * img.width + (x-1) * 4 + c],
              pixels[(y-1) * img.width + x * 4 + c],
              pixels[(y-1) * img.width + (x+1) * 4 + c],
              pixels[y * img.width + (x-1) * 4 + c],
              pixels[y * img.width + x * 4 + c],
              pixels[y * img.width + (x+1) * 4 + c],
              pixels[(y+1) * img.width + (x-1) * 4 + c],
              pixels[(y+1) * img.width + x * 4 + c],
              pixels[(y+1) * img.width + (x+1) * 4 + c]
            ];
            
            // Calculate average (could be expanded to median for better results)
            const sum = neighbors.reduce((a, b) => a + b, 0);
            processedPixels[idx] = Math.floor(sum / neighbors.length);
          }
        }
      }
      
      // Copy processed pixels back to original array for next pass
      if (pass < 2) {
        for (let i = 0; i < pixels.length; i++) {
          pixels[i] = processedPixels[i];
        }
      }
    }
    
    // Clear canvas again
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Put the denoised image data back
    ctx.putImageData(processedData, 0, 0);
    
    // Create a new canvas for the 5x upscaled image
    const upscaledCanvas = document.createElement('canvas');
    upscaledCanvas.width = img.width * scaleFactor;
    upscaledCanvas.height = img.height * scaleFactor;
    const upscaledCtx = upscaledCanvas.getContext('2d');
    
    if (!upscaledCtx) return canvas.toDataURL('image/jpeg', 0.95);
    
    // Apply high quality scaling
    upscaledCtx.imageSmoothingEnabled = true;
    upscaledCtx.imageSmoothingQuality = 'high';
    upscaledCtx.clearRect(0, 0, upscaledCanvas.width, upscaledCanvas.height);
    
    // Draw the denoised image with upscaling
    upscaledCtx.drawImage(
      canvas, 
      0, 0, img.width, img.height, 
      0, 0, upscaledCanvas.width, upscaledCanvas.height
    );
    
    // Apply a final sharpening pass to enhance details after upscaling
    const sharpened = upscaledCtx.getImageData(0, 0, upscaledCanvas.width, upscaledCanvas.height);
    const sharpenedData = sharpened.data;
    
    // Sharpening is computationally expensive, so we'll use a simpler enhancing approach
    for (let i = 0; i < sharpenedData.length; i += 4) {
      // Boost contrast slightly
      for (let j = 0; j < 3; j++) {
        const value = sharpenedData[i + j];
        sharpenedData[i + j] = Math.max(0, Math.min(255, value * 1.1 - 12));
      }
    }
    
    upscaledCtx.putImageData(sharpened, 0, 0);
    
    // Return as data URL with high quality
    return upscaledCanvas.toDataURL('image/jpeg', 1.0);
  };
  
  useEffect(() => {
    const processImage = async () => {
      if (!inputImageUrl) return;
      try {
        console.log("Processing image for 5x enhancement and strong denoising");
        const enhancedUrl = await enhanceImage(inputImageUrl);
        onProcessed(enhancedUrl);
      } catch (error) {
        console.error("Error processing image:", error);
        // If enhancement fails, return the original
        onProcessed(inputImageUrl);
      }
    };
    
    processImage();
  }, [inputImageUrl, onProcessed]);
  
  return <canvas ref={canvasRef} style={{ display: 'none' }} />;
};

export default ImageProcessor;

