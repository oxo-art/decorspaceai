
import { Sliders } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface AdvancedSettingsProps {
  advancedSettings: {
    guidance_scale: number;
    prompt_strength: number;
    num_inference_steps: number;
  };
  setAdvancedSettings: React.Dispatch<React.SetStateAction<{
    guidance_scale: number;
    prompt_strength: number;
    num_inference_steps: number;
  }>>;
}

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  advancedSettings,
  setAdvancedSettings
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Sliders className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium">Advanced Settings</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm">Guidance Scale: {advancedSettings.guidance_scale}</label>
            </div>
            <Slider 
              value={[advancedSettings.guidance_scale]} 
              min={1} 
              max={20} 
              step={0.1}
              onValueChange={(value) => setAdvancedSettings({...advancedSettings, guidance_scale: value[0]})}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm">Prompt Strength: {advancedSettings.prompt_strength.toFixed(1)}</label>
            </div>
            <Slider 
              value={[advancedSettings.prompt_strength]} 
              min={0} 
              max={1} 
              step={0.1}
              onValueChange={(value) => setAdvancedSettings({...advancedSettings, prompt_strength: value[0]})}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm">Steps: {advancedSettings.num_inference_steps}</label>
            </div>
            <Slider 
              value={[advancedSettings.num_inference_steps]} 
              min={10} 
              max={100} 
              step={10}
              onValueChange={(value) => setAdvancedSettings({...advancedSettings, num_inference_steps: value[0]})}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AdvancedSettings;

