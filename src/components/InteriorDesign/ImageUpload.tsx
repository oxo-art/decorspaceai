
import React, { useRef, useState, useEffect } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const [imageData, setImageData] = useState<{
    url: string;
    width: number;
    height: number;
    aspectRatio: number;
  } | null>(null);

  // Enhanced mobile optimization
  const [optimization, setOptimization] = useState({
    isLowEndDevice: false,
    reducedMotion: false
  });

  useEffect(() => {
    const checkDevice = () => {
      const hardwareConcurrency = navigator.hardwareConcurrency || 4;
      const isLowEndDevice = hardwareConcurrency <= 4;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      setOptimization({ isLowEndDevice, reducedMotion });
    };

    checkDevice();
  }, []);

  const validateImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      return "Only image files are allowed";
    }
    
    // 10MB limit
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return "File size must be less than 10MB";
    }
    
    return null;
  };

  const processImageFile = (file: File): Promise<{url: string, width: number, height: number, aspectRatio: number}> => {
    return new Promise((resolve, reject) => {
      const validationError = validateImageFile(file);
      if (validationError) {
        reject(new Error(validationError));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        
        const img = new Image();
        img.onload = () => {
          resolve({ 
            url: result,
            width: img.width,
            height: img.height,
            aspectRatio: img.width / img.height
          });
        };
        img.onerror = () => {
          reject(new Error("Failed to load image"));
        };
        img.src = result;
      };
      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (file: File) => {
    try {
      console.log('Processing image file:', file.name, 'Size:', file.size);
      
      const processedImage = await processImageFile(file);
      
      setImageData(processedImage);
      setImage(processedImage.url);
      setOutput(null);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error((error as Error).message || 'Failed to upload image. Please try again.');
    }
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
          "file-drop-area h-64 cursor-pointer",
          isDragging && "active"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            triggerFileInput();
          }
        }}
        aria-label="Upload room image by clicking or dragging and dropping"
      >
        <input 
          type="file" 
          className="hidden" 
          accept="image/*" 
          ref={fileInputRef}
          onChange={handleFileInputChange}
          aria-label="Upload room image"
        />
        
        {image ? (
          <div className={`relative group overflow-hidden rounded-xl ${
            isMobile ? 'p-2' : 'p-4'
          }`}>
            <img 
              src={image} 
              alt="Uploaded room for interior design transformation" 
              className={`
                w-full h-auto object-contain rounded-xl 
                border border-gray-200 shadow-lg 
                ${isMobile ? 'max-h-[60vh]' : 'max-h-[80vh]'} 
                mx-auto
              `}
              style={{ 
                display: 'block',
                objectFit: 'contain'
              }}
              loading="lazy"
              onLoad={() => console.log('Image loaded successfully')}
              onError={() => {
                console.error('Error loading image');
                toast.error('Error displaying image');
              }}
            />
            
            {/* Overlay for desktop hover effects */}
            {!isMobile && !optimization.isLowEndDevice && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
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
