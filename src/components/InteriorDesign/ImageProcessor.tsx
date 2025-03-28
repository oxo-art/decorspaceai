
import React from 'react';

interface ImageProcessorProps {
  inputImageUrl: string | null;
  onProcessed: (enhancedImageUrl: string) => void;
}

const ImageProcessor: React.FC<ImageProcessorProps> = ({ inputImageUrl, onProcessed }) => {
  React.useEffect(() => {
    if (inputImageUrl) {
      // Simply pass through the original image without any processing
      onProcessed(inputImageUrl);
    }
  }, [inputImageUrl, onProcessed]);
  
  return null;
};

export default ImageProcessor;
