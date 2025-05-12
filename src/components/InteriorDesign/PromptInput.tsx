
import { Textarea } from '@/components/ui/textarea';
import AdvancedSettings from './AdvancedSettings';
import { PenLine, Info } from 'lucide-react';

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
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-1.5">
          <label htmlFor="prompt" className="text-sm font-medium flex items-center gap-1.5">
            <span>Customize Prompt</span>
            <PenLine className="h-4 w-4 text-muted-foreground" />
          </label>
        </div>
        <AdvancedSettings 
          advancedSettings={advancedSettings}
          setAdvancedSettings={setAdvancedSettings}
        />
      </div>
      
      <Textarea
        id="prompt"
        placeholder="Refine and expand your prompt here. This will be the primary focus of the image generation."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="resize-none min-h-[150px]"
      />
      
      <div className="flex items-start gap-2 mt-1 text-xs text-muted-foreground">
        <Info className="h-4 w-4 mt-0.5 text-blue-500 shrink-0" />
        <span>
          The text you enter here will be the <strong>primary focus</strong> of the image generation. Feel free to modify the suggestion from keywords or write your own detailed prompt.
        </span>
      </div>
    </div>
  );
};

export default PromptInput;
