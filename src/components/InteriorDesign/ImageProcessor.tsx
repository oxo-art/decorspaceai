
import React, { useRef, useEffect } from 'react';

interface ImageProcessorProps {
  inputImageUrl: string | null;
  onProcessed: (enhancedImageUrl: string) => void;
}

const ImageProcessor: React.FC<ImageProcessorProps> = ({ inputImageUrl, onProcessed }) => {
  useEffect(() => {
    if (inputImageUrl) {
      // Simply pass through the original image without processing
      onProcessed(inputImageUrl);
    }
  }, [inputImageUrl, onProcessed]);
  
  return null;
};

export default ImageProcessor;
