import { Textarea } from '@/components/ui/textarea';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
}

const PromptInput: React.FC<PromptInputProps> = ({
  prompt,
  setPrompt
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-foreground">
          Describe your design vision
        </label>
      </div>
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., Cozy bedroom with soft lighting"
        className="min-h-[120px] resize-none"
      />
    </div>
  );
};

export default PromptInput;