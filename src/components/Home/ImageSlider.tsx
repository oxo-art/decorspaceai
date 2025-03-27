
import React, { useState, useRef, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";

interface ImageSliderProps {
  beforeImage: string;
  afterImage: string;
  height?: string;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ 
  beforeImage, 
  afterImage,
  height = "400px"
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleSliderChange = (value: number[]) => {
    setSliderPosition(value[0]);
  };

  return (
    <div className="relative w-full rounded-lg overflow-hidden" style={{ height }}>
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
          className="absolute top-0 bottom-0 w-1 bg-white shadow-md cursor-ew-resize"
          style={{ left: `${sliderPosition}%`, marginLeft: "-2px" }}
        />
        
        {/* Labels */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 text-sm rounded">
          Before
        </div>
        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 text-sm rounded">
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
