
import React, { useRef } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ImageUploadProps {
  image: string | null;
  setImage: (image: string | null) => void;
  setOutput: (output: string | null) => void;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  image, 
  setImage,
  setOutput,
  isDragging,
  setIsDragging
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
        setOutput(null);
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

  return (
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
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-lg">
              <Button variant="secondary" size="sm" className="gap-2">
                <Upload size={16} />
                <span>Change Image</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="image-placeholder">
            <div className="flex flex-col items-center text-gray-500">
              <Upload size={32} className="mb-2 text-gray-400" />
              <p className="text-sm font-medium mb-1">Upload a room photo</p>
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
  );
};

export default ImageUpload;
