
import React, { useRef } from 'react';

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
    
    // Apply mild denoising and high-quality scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Step 1: Draw original size with slight smoothing
    ctx.drawImage(img, 0, 0, img.width, img.height);
    
    // Step 2: Mild denoising by blending
    ctx.globalAlpha = 0.5;
    for(let i = 0; i < 2; i++) {
      ctx.drawImage(canvas, 0, 0, img.width, img.height);
    }
    ctx.globalAlpha = 1.0;
    
    // Step 3: Upscale the smoothed image
    ctx.drawImage(canvas, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
    
    return canvas.toDataURL('image/jpeg', 0.9);
  };
  
  React.useEffect(() => {
    const processImage = async () => {
      if (!inputImageUrl) return;
      try {
        const enhancedUrl = await enhanceImage(inputImageUrl);
        onProcessed(enhancedUrl);
      } catch (error) {
        console.error("Error processing image:", error);
      }
    };
    
    processImage();
  }, [inputImageUrl, onProcessed]);
  
  return <canvas ref={canvasRef} style={{ display: 'none' }} />;
};

export default ImageProcessor;
