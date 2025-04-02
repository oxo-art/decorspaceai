
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

interface UpscaleControlsProps {
  scale: number;
  setScale: (scale: number) => void;
  faceEnhance: boolean;
  setFaceEnhance: (enhance: boolean) => void;
}

const UpscaleControls: React.FC<UpscaleControlsProps> = ({
  scale,
  setScale,
  faceEnhance,
  setFaceEnhance
}) => {
  const handleScaleChange = (value: number[]) => {
    setScale(value[0]);
  };

  return (
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
  );
};

export default UpscaleControls;
