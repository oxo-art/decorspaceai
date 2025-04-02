
import React, { useRef } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface UpscalerInputProps {
  image: string | null;
  setImage: (image: string | null) => void;
  scale: number;
  setScale: (scale: number) => void;
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
  isDragging,
  setIsDragging,
  isLoading,
  handleUpscale
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleScaleChange = (value: number[]) => {
    setScale(value[0]);
  };

  return (
    <div className="space-y-6 animate-scale-in" style={{ animationDelay: '0.1s' }}>
      <Card className="overflow-hidden border border-gray-200 shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
            <Upload className="h-5 w-5 text-yellow-500" /> Upload Image
          </h2>
          
          <div className="space-y-4">
            <div 
              className={cn(
                "file-drop-area h-64",
                isDragging && "active"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerFileInput}
            >
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                ref={fileInputRef}
                onChange={handleFileInputChange}
              />
              
              {image ? (
                <div className="relative w-full h-full">
                  <img 
                    src={image} 
                    alt="Uploaded" 
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
              ) : (
                <div className="image-placeholder">
                  <div className="flex flex-col items-center text-gray-500">
                    <Upload size={32} className="mb-2 text-gray-400" />
                    <p className="text-sm font-medium mb-1">Upload an image</p>
                    <p className="text-xs">or click to browse</p>
                  </div>
                </div>
              )}
            </div>
            
            {image && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300" 
                onClick={triggerFileInput}
              >
                <ImageIcon size={16} className="text-gray-700" />
                Change Image
              </Button>
            )}
          </div>
          
          <div className="mt-6 space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <h3 className="text-sm font-medium">Upscale Factor: {scale}x</h3>
              </div>
              <Slider
                value={[scale]}
                min={1}
                max={4}
                step={1}
                onValueChange={handleScaleChange}
                className="w-full"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">1x</span>
                <span className="text-xs text-gray-500">4x</span>
              </div>
            </div>
          </div>
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
