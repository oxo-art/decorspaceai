import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Info } from 'lucide-react';
import { getAIDesignSuggestion } from '@/services/openaiService';
import { toast } from 'sonner';

interface KeywordsToPromptProps {
  onPromptGenerated: (prompt: string) => void;
  setShowKeywords: (show: boolean) => void;
}

const KeywordsToPrompt: React.FC<KeywordsToPromptProps> = ({
  onPromptGenerated,
  setShowKeywords,
}) => {
  const [keywords, setKeywords] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastKeywords, setLastKeywords] = useState('');
  const [variationCount, setVariationCount] = useState(0);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGeneratePrompt = async () => {
    const keywordsToUse = keywords.trim();

    if (!keywordsToUse) {
      toast.error('Please enter keywords');
      return;
    }

    setIsLoading(true);

    const isVariation = keywordsToUse === lastKeywords;

    if (isVariation) {
      setVariationCount(prev => prev + 1);
    } else {
      setVariationCount(0);
    }

    try {
      setLastKeywords(keywordsToUse);

      const response = await getAIDesignSuggestion({
        prompt: `Create a detailed interior design description using these keywords: ${keywordsToUse}`,
        isVariation: isVariation,
      });

      if (response.result) {
        onPromptGenerated(response.result);
        toast.success(isVariation ? 'New variation created' : 'Prompt generated');
        setHasGenerated(true);
      }
    } catch (error) {
      console.error("Error generating prompt:", error);
      toast.error('Failed to generate prompt');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center gap-2 w-full">
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
          ) : lastKeywords === keywords.trim() && keywords.trim() !== '' ? (
            <div className="flex items-center gap-1">
              <RefreshCw className="h-4 w-4" />
              <span>New Variation</span>
            </div>
          ) : (
            <span>Generate</span>
          )}
        </Button>
      </div>
      {hasGenerated && (
        <div className="flex items-start gap-2 mt-1 text-xs text-muted-foreground">
          <Info className="h-4 w-4 mt-0.5 text-blue-500 shrink-0" />
          <span>
            <strong>Note:</strong> if the results appear deformed or unsatisfactory, click "<span className="font-semibold">New Variation</span>" to refresh and generate a new prompt.
          </span>
        </div>
      )}
    </div>
  );
};

export default KeywordsToPrompt;
