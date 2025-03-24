
import { Textarea } from '@/components/ui/textarea';
import AdvancedSettings from './AdvancedSettings';

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
        <label htmlFor="prompt" className="text-sm font-medium">
          Design Prompt
        </label>
        <AdvancedSettings 
          advancedSettings={advancedSettings}
          setAdvancedSettings={setAdvancedSettings}
        />
      </div>
      <Textarea
        id="prompt"
        placeholder="Describe the interior design you want - (e.g., A modern minimalist living room with turquoise sofa set, and green indoor plants.)"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="resize-none"
        rows={3}
      />
    </div>
  );
};

export default PromptInput;
