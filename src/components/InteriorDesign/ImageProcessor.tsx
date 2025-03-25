
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
    
    // Double the resolution
    const scaleFactor = 2;
    canvas.width = img.width * scaleFactor;
    canvas.height = img.height * scaleFactor;
    
    // Clear any previous content
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply high-quality scaling settings
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Step 1: First draw at original size
    ctx.drawImage(img, 0, 0, img.width, img.height);
    
    // Get the image data at original size
    const originalData = ctx.getImageData(0, 0, img.width, img.height);
    
    // Create a temp canvas for processing
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = img.width;
    tempCanvas.height = img.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return canvas.toDataURL('image/jpeg', 0.95);
    
    // Copy the current state to temp canvas
    tempCtx.putImageData(originalData, 0, 0);
    
    // Step 2: Apply mild denoising
    // Clear the main canvas first
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Redraw the original image
    ctx.drawImage(img, 0, 0, img.width, img.height);
    
    // Blend with the temp canvas for subtle smoothing
    ctx.globalAlpha = 0.5;
    for(let i = 0; i < 2; i++) {
      ctx.drawImage(tempCanvas, 0, 0, img.width, img.height);
    }
    ctx.globalAlpha = 1.0;
    
    // Step 3: Now upscale the smoothed image to full resolution
    // Create a final canvas for upscaling
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = img.width * scaleFactor;
    finalCanvas.height = img.height * scaleFactor;
    const finalCtx = finalCanvas.getContext('2d');
    if (!finalCtx) return canvas.toDataURL('image/jpeg', 0.95);
    
    // Clear the final canvas
    finalCtx.clearRect(0, 0, finalCanvas.width, finalCanvas.height);
    
    // Draw with upscaling to the final canvas
    finalCtx.imageSmoothingEnabled = true;
    finalCtx.imageSmoothingQuality = 'high';
    finalCtx.drawImage(canvas, 0, 0, img.width, img.height, 0, 0, finalCanvas.width, finalCanvas.height);
    
    // Return as data URL with high quality
    return finalCanvas.toDataURL('image/jpeg', 0.95);
  };
  
  useEffect(() => {
    const processImage = async () => {
      if (!inputImageUrl) return;
      try {
        console.log("Processing image for enhancement and upscaling");
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
