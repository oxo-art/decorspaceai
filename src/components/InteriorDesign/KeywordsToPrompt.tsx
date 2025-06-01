
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

    // Check if this is a variation of the same keywords
    const isVariation = keywordsToUse === lastKeywords;

    // If it's the same keywords, increment the variation count
    if (isVariation) {
      setVariationCount(prev => prev + 1);
    } else {
      // Reset variation count for new keywords
      setVariationCount(0);
    }

    try {
      // Save current keywords to track when we're generating a new variation
      setLastKeywords(keywordsToUse);

      const response = await getAIDesignSuggestion({
        prompt: keywordsToUse,
        isVariation: isVariation,
      });

      if (response.result) {
        onPromptGenerated(response.result);
        toast.success('Prompt suggestion created');
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
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
        <Input
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="Enter keywords separated by commas"
          className="flex-1 min-h-[44px]"
        />
        <Button
          onClick={handleGeneratePrompt}
          disabled={isLoading}
          className="whitespace-nowrap min-h-[44px] w-full sm:w-auto"
          size="default"
          variant={lastKeywords === keywords.trim() && keywords.trim() !== '' ? "outline" : "default"}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              <span>Generating...</span>
            </>
          ) : lastKeywords === keywords.trim() && keywords.trim() !== '' ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              <span>New Variation</span>
            </>
          ) : (
            <span>Suggest Prompt</span>
          )}
        </Button>
      </div>
      {hasGenerated && (
        <div className="flex items-start gap-2 mt-1 text-xs text-muted-foreground">
          <Info className="h-4 w-4 mt-0.5 text-blue-500 shrink-0" />
          <span>
            <strong>Note:</strong> If the results appear deformed or unsatisfactory, click new variation to refresh and generate a new prompt.
          </span>
        </div>
      )}
    </div>
  );
};

export default KeywordsToPrompt;
