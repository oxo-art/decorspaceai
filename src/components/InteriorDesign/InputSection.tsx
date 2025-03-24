
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import ImageUpload from './ImageUpload';
import PromptInput from './PromptInput';

interface InputSectionProps {
  image: string | null;
  setImage: (image: string | null) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  setOutput: (output: string | null) => void;
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
  isLoading: boolean;
  handleGenerate: () => void;
}

const InputSection: React.FC<InputSectionProps> = ({
  image,
  setImage,
  prompt,
  setPrompt,
  isDragging,
  setIsDragging,
  setOutput,
  advancedSettings,
  setAdvancedSettings,
  isLoading,
  handleGenerate
}) => {
  return (
    <div className="space-y-6 animate-scale-in" style={{ animationDelay: '0.1s' }}>
      <Card className="overflow-hidden border border-gray-200 shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-medium mb-4">Input</h2>
          
          <ImageUpload 
            image={image}
            setImage={setImage}
            setOutput={setOutput}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
          />
          
          <div className="mt-6">
            <PromptInput 
              prompt={prompt}
              setPrompt={setPrompt}
              advancedSettings={advancedSettings}
              setAdvancedSettings={setAdvancedSettings}
            />
          </div>
        </div>
        
        <Separator />
        
        <div className="p-4 flex justify-end items-center">
          <Button 
            onClick={handleGenerate}
            disabled={!image || !prompt.trim() || isLoading}
            className="transition-all-300"
          >
            {isLoading ? 'Generating...' : 'Generate Design'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default InputSection;
