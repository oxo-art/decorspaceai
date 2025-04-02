
import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageName, setImageName] = useState<string>("");

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setImageName(file.name);
    
    // Check file size
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.warning('Large images may take longer to process or might be automatically resized');
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

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            handleImageUpload(file);
            break;
          }
        }
      }
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
                "file-drop-area h-64 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center relative",
                isDragging && "border-yellow-500 bg-yellow-50"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerFileInput}
              onPaste={handlePaste}
              tabIndex={0}
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
                    className="w-full h-full object-contain rounded-lg p-2"
                  />
                  {imageName && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center truncate">
                      {imageName}
                    </div>
                  )}
                </div>
              ) : (
                <div className="image-placeholder">
                  <div className="flex flex-col items-center text-gray-500">
                    <Upload size={32} className="mb-2 text-gray-400" />
                    <p className="text-sm font-medium mb-1">Upload an image</p>
                    <p className="text-xs">Drag & drop, paste, or click to browse</p>
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
            
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Face Enhancement</h3>
              <Switch 
                checked={faceEnhance}
                onCheckedChange={setFaceEnhance}
              />
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
