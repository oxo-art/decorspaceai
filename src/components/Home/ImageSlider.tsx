import React, { useState, useRef, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageSliderProps {
  beforeImage: string;
  afterImage: string;
  height?: string;
  width?: string;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ 
  beforeImage, 
  afterImage,
  height = "500px",
  width = "100%"
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({ before: false, after: false });
  const [imageErrors, setImageErrors] = useState({ before: false, after: false });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleSliderChange = (value: number[]) => {
    setSliderPosition(value[0]);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    
    let clientX: number;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    
    const rect = containerRef.current.getBoundingClientRect();
    const position = ((clientX - rect.left) / rect.width) * 100;
    
    setSliderPosition(Math.max(0, Math.min(100, position)));
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    let clientX: number;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    
    const rect = containerRef.current.getBoundingClientRect();
    const position = ((clientX - rect.left) / rect.width) * 100;
    
    setSliderPosition(Math.max(0, Math.min(100, position)));
  };

  const handleBeforeImageLoad = () => {
    setImagesLoaded(prev => ({ ...prev, before: true }));
  };

  const handleAfterImageLoad = () => {
    setImagesLoaded(prev => ({ ...prev, after: true }));
  };

  const handleBeforeImageError = () => {
    setImageErrors(prev => ({ ...prev, before: true }));
  };

  const handleAfterImageError = () => {
    setImageErrors(prev => ({ ...prev, after: true }));
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };
    
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalMouseUp);
    
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, []);

  const bothImagesLoaded = imagesLoaded.before && imagesLoaded.after;
  const hasErrors = imageErrors.before || imageErrors.after;

  return (
    <div 
      className="relative w-full h-full rounded-lg overflow-hidden shadow-lg bg-muted" 
      style={{ height, width }}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
    >
      {!bothImagesLoaded && !hasErrors && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
          <div className="w-8 h-8 border-4 border-muted-foreground/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}

      {hasErrors && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
          <p className="text-muted-foreground text-sm">Failed to load images</p>
        </div>
      )}

      <div 
        ref={containerRef}
        className="relative w-full h-full cursor-pointer"
        style={{ opacity: bothImagesLoaded && !hasErrors ? 1 : 0 }}
        onClick={handleContainerClick}
        onTouchStart={handleContainerClick}
      >
        {/* Before Image (Full width) */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={beforeImage}
            alt="Before transformation"
            className="w-full h-full object-cover"
            onLoad={handleBeforeImageLoad}
            onError={handleBeforeImageError}
          />
        </div>
        
        {/* After Image (Partial width based on slider) */}
        <div 
          className="absolute inset-0 h-full overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={afterImage}
            alt="After transformation"
            className="absolute top-0 left-0 w-full h-full object-cover"
            style={{ 
              width: `${100 / (sliderPosition / 100)}%`,
              maxWidth: "none"
            }}
            onLoad={handleAfterImageLoad}
            onError={handleAfterImageError}
          />
        </div>
        
        {/* Simple Slider Divider Line */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white/80 cursor-ew-resize"
          style={{ 
            left: `${sliderPosition}%`, 
            marginLeft: "-2px",
            zIndex: 5
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg cursor-ew-resize border-2 border-gray-200">
            <div className="flex space-x-0.5">
              <div className="w-0.5 h-3 bg-black rounded-full"></div>
              <div className="w-0.5 h-3 bg-black rounded-full"></div>
              <div className="w-0.5 h-3 bg-black rounded-full"></div>
            </div>
          </div>
        </div>
        
        {/* Simple Labels */}
        <div 
          className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 text-sm rounded font-medium"
          style={{ opacity: sliderPosition <= 10 ? 0 : 1 }}
        >
          Before
        </div>
        <div 
          className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 text-sm rounded font-medium"
          style={{ opacity: sliderPosition >= 90 ? 0 : 1 }}
        >
          After
        </div>
      </div>
      
    </div>
  );
};

export default ImageSlider;