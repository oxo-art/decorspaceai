
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import ImageDropzone from './ImageDropzone';
import UpscaleControls from './UpscaleControls';

interface UpscalerInputProps {
  image: string | null;
  setImage: (image: string | null) => void;
  scale: number;
  setScale: (scale: number) => void;
  faceEnhance: boolean;
  setFaceEnhance: (enhance: boolean) => void;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  isLoading: boolean;
  handleUpscale: () => void;
}

const UpscalerInput: React.FC<UpscalerInputProps> = ({
  image,
  setImage,
  scale,
  setScale,
  faceEnhance,
  setFaceEnhance,
  isDragging,
  setIsDragging,
  isLoading,
  handleUpscale
}) => {
  const [imageName, setImageName] = useState<string>("");

  return (
    <div className="space-y-6 animate-scale-in" style={{ animationDelay: '0.1s' }}>
      <Card className="overflow-hidden border border-gray-200 shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
            <Upload className="h-5 w-5 text-yellow-500" /> Upload Image
          </h2>
          
          <ImageDropzone 
            image={image}
            setImage={setImage}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            imageName={imageName}
            setImageName={setImageName}
          />
          
          <UpscaleControls 
            scale={scale}
            setScale={setScale}
            faceEnhance={faceEnhance}
            setFaceEnhance={setFaceEnhance}
          />
        </div>
        
        <Separator />
        
        <div className="p-4 flex justify-end items-center">
          <Button 
            onClick={handleUpscale}
            disabled={!image || isLoading}
            className="transition-all-300"
          >
            {isLoading ? 'Processing...' : 'Upscale Image'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default UpscalerInput;
