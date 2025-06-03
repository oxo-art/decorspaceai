
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import ImageUpload from './ImageUpload';
import PromptInput from './PromptInput';
import KeywordsToPrompt from './KeywordsToPrompt';
import { Camera, KeySquare, Pencil, Zap } from 'lucide-react';
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
  useOpenAI?: boolean;
  setUseOpenAI?: (useOpenAI: boolean) => void;
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
  handleGenerate,
  useOpenAI = false,
  setUseOpenAI
}) => {
  const [showKeywords] = useState(true);

  const shouldUseOpenAI = useOpenAI || !image;
  const buttonText = isLoading ? 'Generating...' : shouldUseOpenAI ? 'Generate with AI' : 'Transform Image';

  return (
    <div className="space-y-4 md:space-y-6 animate-scale-in" style={{ animationDelay: '0.1s' }}>
      <Card className="overflow-hidden border border-gray-200 shadow-sm">
        <div className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-medium mb-3 md:mb-4 flex items-center gap-2">
            <Camera className="h-4 w-4 md:h-5 md:w-5 text-yellow-500" /> Upload
          </h2>
          
          <ImageUpload 
            image={image}
            setImage={setImage}
            setOutput={setOutput}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
          />
          
          {setUseOpenAI && (
            <div className="mt-4 flex items-center space-x-2">
              <Switch
                id="use-openai"
                checked={useOpenAI}
                onCheckedChange={setUseOpenAI}
              />
              <Label htmlFor="use-openai" className="text-sm flex items-center gap-1">
                <Zap className="h-4 w-4 text-yellow-500" />
                Use OpenAI (new model)
              </Label>
            </div>
          )}
          
          {!image && !useOpenAI && (
            <p className="text-xs text-muted-foreground mt-2">
              No image uploaded - will use OpenAI generation automatically
            </p>
          )}
        </div>
      </Card>

      <Card className="overflow-hidden border border-gray-200 shadow-sm">
        <div className="p-3 md:p-4">
          <h2 className="text-base md:text-lg font-medium mb-2 md:mb-3 flex items-center gap-2">
            <KeySquare className="h-4 w-4 text-yellow-500" /> Keywords to Prompt
          </h2>
          
          <KeywordsToPrompt 
            onPromptGenerated={setPrompt}
            setShowKeywords={() => {}}
          />
        </div>
      </Card>
      
      <Card className="overflow-hidden border border-gray-200 shadow-sm">
        <div className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-medium mb-3 md:mb-4 flex items-center gap-2">
            <Pencil className="h-4 w-4 md:h-5 md:w-5 text-yellow-500" /> Prompt
          </h2>
          
          <div>
            <PromptInput 
              prompt={prompt}
              setPrompt={setPrompt}
              advancedSettings={advancedSettings}
              setAdvancedSettings={setAdvancedSettings}
              showAdvanced={image && !useOpenAI}
            />
          </div>
        </div>
        
        <Separator />
        
        <div className="p-3 md:p-4 flex justify-center md:justify-end items-center">
          <Button 
            onClick={handleGenerate}
            disabled={!prompt.trim() || isLoading}
            className="w-full md:w-auto transition-all-300 min-h-[44px] text-base font-medium"
            size="lg"
          >
            {buttonText}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default InputSection;
