
import React, { useRef } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ImageDropzoneProps {
  image: string | null;
  setImage: (image: string | null) => void;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  imageName: string;
  setImageName: (name: string) => void;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  image,
  setImage,
  isDragging,
  setIsDragging,
  imageName,
  setImageName
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
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
        <button 
          onClick={triggerFileInput}
          className="w-full gap-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300 h-9 rounded-md px-3"
        >
          <ImageIcon size={16} className="text-gray-700" />
          Change Image
        </button>
      )}
    </div>
  );
};

export default ImageDropzone;
