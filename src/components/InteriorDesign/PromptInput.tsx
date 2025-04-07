
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import AdvancedSettings from './AdvancedSettings';
import { PenLine, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import KeywordsToPrompt from './KeywordsToPrompt';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
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

const PromptInput: React.FC<PromptInputProps> = ({
  prompt,
  setPrompt,
  advancedSettings,
  setAdvancedSettings
}) => {
  const [showKeywordsInput, setShowKeywordsInput] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-1.5">
          <label htmlFor="prompt" className="text-sm font-medium flex items-center gap-1.5">
            <span>Prompt</span>
            <PenLine className="h-4 w-4 text-muted-foreground" />
          </label>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50"
            onClick={() => setShowKeywordsInput(!showKeywordsInput)}
          >
            <Sparkles className="h-4 w-4" />
          </Button>
        </div>
        <AdvancedSettings 
          advancedSettings={advancedSettings}
          setAdvancedSettings={setAdvancedSettings}
        />
      </div>
      
      {showKeywordsInput ? (
        <KeywordsToPrompt onPromptGenerated={setPrompt} setShowKeywords={setShowKeywordsInput} />
      ) : (
        <Textarea
          id="prompt"
          placeholder="Describe the interior you want - (e.g - A living room with turquoise sofa set, a television set, green indoor plants.)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="resize-none min-h-[150px]"
        />
      )}
    </div>
  );
};

export default PromptInput;
