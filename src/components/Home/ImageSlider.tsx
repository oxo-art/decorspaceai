
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
  height = "400px",
  width = "100%"
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
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

  // Calculate visibility for the before and after labels based on slider position
  const beforeLabelOpacity = sliderPosition >= 90 ? 0 : 1; // Hide "Before" when slider is far right
  const afterLabelOpacity = sliderPosition <= 10 ? 0 : 1;  // Hide "After" when slider is far left

  return (
    <div 
      className="relative w-full h-full rounded-lg overflow-hidden shadow-md" 
      style={{ height, width }}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
    >
      <div 
        ref={containerRef}
        className="relative w-full h-full"
      >
        {/* Before Image (Full width) */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={beforeImage}
            alt="Before transformation"
            className="w-full h-full object-cover"
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
          />
        </div>
        
        {/* Slider Divider Line */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white shadow-md cursor-ew-resize z-10"
          style={{ left: `${sliderPosition}%`, marginLeft: "-2px" }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
            <ChevronLeft className="w-4 h-4 text-gray-700" />
            <ChevronRight className="w-4 h-4 text-gray-700" />
          </div>
        </div>
        
        {/* Labels with dynamic visibility */}
        <div 
          className="absolute top-4 left-4 bg-black bg-opacity-60 text-white px-2 py-1 text-sm rounded-md font-medium transition-opacity duration-300"
          style={{ opacity: beforeLabelOpacity }}
        >
          Before
        </div>
        <div 
          className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-2 py-1 text-sm rounded-md font-medium transition-opacity duration-300"
          style={{ opacity: afterLabelOpacity }}
        >
          After
        </div>
      </div>
      
      {/* Slider Control */}
      <div className="absolute bottom-4 left-0 right-0 mx-auto w-3/4 max-w-md">
        <Slider
          value={[sliderPosition]}
          min={0}
          max={100}
          step={1}
          onValueChange={handleSliderChange}
          className="z-10"
        />
      </div>
    </div>
  );
};

export default ImageSlider;
