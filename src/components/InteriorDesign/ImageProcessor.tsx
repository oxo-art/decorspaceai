
import React, { useEffect } from 'react';

interface ImageProcessorProps {
  inputImageUrl: string | null;
  onProcessed: (enhancedImageUrl: string) => void;
}

const ImageProcessor: React.FC<ImageProcessorProps> = ({ inputImageUrl, onProcessed }) => {
  useEffect(() => {
    if (inputImageUrl) {
      try {
        // Process the image immediately without delay
        onProcessed(inputImageUrl);
      } catch (error) {
        console.error("Error processing image:", error);
      }
    }
  }, [inputImageUrl, onProcessed]);
  
  return null;
};

export default ImageProcessor;
