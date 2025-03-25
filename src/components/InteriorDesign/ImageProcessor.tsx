
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
    
    // Create a clean canvas with proper dimensions
    canvas.width = img.width * 2;  // Double the resolution
    canvas.height = img.height * 2;
    
    // Clear any previous content
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply high-quality scaling settings
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Draw the image at the higher resolution
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    // Apply a light denoise effect
    // This is a simple implementation that slightly blurs the image to reduce noise
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return canvas.toDataURL('image/jpeg', 0.95);
    
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    
    // Copy our current canvas to the temp canvas
    tempCtx.drawImage(canvas, 0, 0);
    
    // Clear the main canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the original image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    // Blend with slight blur for denoising (less aggressive approach)
    ctx.globalAlpha = 0.3;
    ctx.filter = 'blur(0.5px)';
    ctx.drawImage(tempCanvas, 0, 0);
    ctx.filter = 'none';
    ctx.globalAlpha = 1.0;
    
    // Return as data URL with high quality
    return canvas.toDataURL('image/jpeg', 0.95);
  };
  
  useEffect(() => {
    const processImage = async () => {
      if (!inputImageUrl) return;
      try {
        console.log("Processing image for enhancement");
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
