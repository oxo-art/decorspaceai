
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import ImageUpload from './ImageUpload';
import PromptInput from './PromptInput';
import KeywordsToPrompt from './KeywordsToPrompt';
import { Camera, KeySquare, Pencil } from 'lucide-react';
import { useState } from 'react';

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
  const [showKeywords] = useState(true);

  return (
    <div className="space-y-4 md:space-y-6 animate-scale-in" style={{ animationDelay: '0.1s' }}>
      <Card className="glass-card overflow-hidden hover:shadow-glass-hover transition-all duration-300">
        <div className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-medium mb-3 md:mb-4 flex items-center gap-2">
            <Camera className="h-4 w-4 md:h-5 md:w-5 text-primary" /> Upload
          </h2>
          
          <ImageUpload 
            image={image}
            setImage={setImage}
            setOutput={setOutput}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
          />
        </div>
      </Card>

      <Card className="glass-card overflow-hidden hover:shadow-glass-hover transition-all duration-300">
        <div className="p-3 md:p-4">
          <h2 className="text-base md:text-lg font-medium mb-2 md:mb-3 flex items-center gap-2">
            <KeySquare className="h-4 w-4 text-primary" /> Keywords to Prompt
          </h2>
          
          <KeywordsToPrompt 
            onPromptGenerated={setPrompt}
            setShowKeywords={() => {}}
          />
        </div>
      </Card>
      
      <Card className="glass-card overflow-hidden hover:shadow-glass-hover transition-all duration-300">
        <div className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-medium mb-3 md:mb-4 flex items-center gap-2">
            <Pencil className="h-4 w-4 md:h-5 md:w-5 text-primary" /> Prompt
          </h2>
          
          <div>
            <PromptInput 
              prompt={prompt}
              setPrompt={setPrompt}
              advancedSettings={advancedSettings}
              setAdvancedSettings={setAdvancedSettings}
            />
          </div>
        </div>
        
        <Separator />
        
        <div className="p-3 md:p-4 flex justify-center md:justify-end items-center">
          <Button 
            onClick={handleGenerate}
            disabled={!image || !prompt.trim() || isLoading}
            className="glass-button w-full md:w-auto transition-all duration-300 min-h-[44px] text-base font-medium hover:shadow-glow-lg"
            size="lg"
          >
            {isLoading ? 'Generating...' : 'Generate'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default InputSection;
