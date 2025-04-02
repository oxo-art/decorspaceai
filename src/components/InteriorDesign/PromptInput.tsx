
import { Textarea } from '@/components/ui/textarea';
import AdvancedSettings from './AdvancedSettings';
import { PenLine } from 'lucide-react';

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
        <label htmlFor="prompt" className="text-sm font-medium flex items-center gap-1.5">
          <span>Prompt</span>
          <PenLine className="h-4 w-4 text-muted-foreground" />
        </label>
        <AdvancedSettings 
          advancedSettings={advancedSettings}
          setAdvancedSettings={setAdvancedSettings}
        />
      </div>
      <Textarea
        id="prompt"
        placeholder="Describe the interior you want - (e.g - A living room with turquoise sofa set, a television set, green indoor plants.)"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="resize-none min-h-[150px]"
      />
    </div>
  );
};

export default PromptInput;
