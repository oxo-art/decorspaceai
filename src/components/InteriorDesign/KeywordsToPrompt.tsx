
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
  const [hasGenerated, setHasGenerated] = useState(false); // To show the info after generation

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
        prompt: `Generate a descriptive starting point based on these keywords: ${keywordsToUse}. Create a brief descriptive interior design scene using ONLY these keywords (no extra objects). Write ONE sentence starting with 'Imagine' (25-30 words max). This will be FURTHER REFINED by user input in a separate prompt field, so keep it basic and focused on the keywords only.`,
        isVariation: isVariation,
      });

      if (response.result) {
        onPromptGenerated(response.result);
        toast.success(isVariation ? 'New keyword variation created' : 'Basic prompt generated from keywords');
        setHasGenerated(true); // Show the info note
      }
    } catch (error) {
      console.error("Error generating prompt:", error);
      toast.error('Failed to generate prompt from keywords');
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
          placeholder="Enter design elements separated by commas"
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
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              <span>New Variation</span>
            </>
          ) : (
            <span>Generate</span>
          )}
        </Button>
      </div>
      {hasGenerated && (
        <div className="flex items-start gap-2 mt-1 text-xs text-muted-foreground">
          <Info className="h-4 w-4 mt-0.5 text-blue-500 shrink-0" />
          <span>
            <strong>Basic prompt created!</strong> Now you can refine and expand it in the "Customize Prompt" section below.
          </span>
        </div>
      )}
    </div>
  );
};

export default KeywordsToPrompt;
