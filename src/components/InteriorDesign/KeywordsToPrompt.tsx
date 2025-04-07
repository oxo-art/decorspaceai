
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
        prompt: `Create a detailed interior design description using these keywords: ${keywords}`
      });
      
      if (response.result) {
        onPromptGenerated(response.result);
        toast.success('Prompt generated');
      }
    } catch (error) {
      console.error("Error generating prompt:", error);
      toast.error('Failed to generate prompt');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        placeholder="Enter keywords separated by commas"
        className="flex-1"
      />
      <Button
        onClick={handleGeneratePrompt}
        disabled={isLoading}
        className="whitespace-nowrap"
        size="sm"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            <span className="hidden sm:inline">Generating...</span>
          </>
        ) : (
          <span>Generate</span>
        )}
      </Button>
    </div>
  );
};

export default KeywordsToPrompt;
