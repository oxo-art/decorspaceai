import { Textarea } from '@/components/ui/textarea';
import { PenLine } from 'lucide-react';

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
          <PenLine className="w-4 h-4 inline mr-2" />
          Describe your design vision
        </label>
      </div>
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., Modern minimalist living room with warm wood accents, comfortable seating, and natural lighting"
        className="min-h-[120px] resize-none"
      />
    </div>
  );
};

export default PromptInput;