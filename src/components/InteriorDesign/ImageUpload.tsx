
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

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          // Ensure we have a proper base64 string
          const base64String = reader.result as string;
          console.log('Image converted to base64, size:', base64String.length);
          resolve(base64String);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should be less than 10MB');
      return;
    }

    try {
      console.log('Processing image file:', file.name, 'Size:', file.size);
      
      // Convert to base64
      const base64Image = await convertImageToBase64(file);
      
      // Validate base64 string
      if (!base64Image || base64Image.length < 100) {
        throw new Error('Invalid image data');
      }
      
      setImage(base64Image);
      setOutput(null);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
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
          <div className="relative w-full h-full">
            <img 
              src={image} 
              alt="Uploaded room for interior design transformation" 
              className="w-full h-full object-cover rounded-lg"
              style={{ maxWidth: '100%', maxHeight: '100%' }}
              onLoad={() => console.log('Image loaded successfully')}
              onError={() => {
                console.error('Error loading image');
                toast.error('Error displaying image');
              }}
            />
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
