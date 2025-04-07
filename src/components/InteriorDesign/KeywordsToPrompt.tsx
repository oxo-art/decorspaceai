
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { getAIDesignSuggestion } from '@/services/openaiService';
import { toast } from 'sonner';

interface KeywordsToPromptProps {
  onPromptGenerated: (prompt: string) => void;
  setShowKeywords: (show: boolean) => void;
}

const KeywordsToPrompt: React.FC<KeywordsToPromptProps> = ({ 
  onPromptGenerated, 
  setShowKeywords 
}) => {
  const [keywords, setKeywords] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGeneratePrompt = async () => {
    if (!keywords.trim()) {
      toast.error('Please enter keywords');
      return;
    }

    setIsLoading(true);
    try {
      const response = await getAIDesignSuggestion({
        prompt: `Convert these interior design keywords into a detailed design prompt. Focus only on the listed elements and don't add unrelated items: ${keywords}`
      });
      
      if (response.result) {
        onPromptGenerated(response.result);
        setShowKeywords(false);
        toast.success('Prompt generated successfully');
      }
    } catch (error) {
      console.error("Error generating prompt:", error);
      toast.error('Failed to generate prompt');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">
          Enter keywords separated by commas (e.g., modern, blue walls, wooden floor)
        </label>
        <Input
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="Enter keywords..."
          className="w-full"
        />
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleGeneratePrompt}
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Prompt'
          )}
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowKeywords(false)}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default KeywordsToPrompt;
