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

      // --- STRONGER, MORE STRICT PROMPT  ---
      const response = await getAIDesignSuggestion({
        prompt: `Using ONLY and EXACTLY these keywords: ${keywordsToUse}, create a design description for an interior image. Do NOT add any extra items, objects, or concepts not listed. Do NOT distort or destroy the original content—just use the provided keywords. Write TWO direct sentences starting with 'Imagine' (total 40-45 words), with proper full stops, and nothing unrelated.`,
        isVariation: isVariation,
      });

      if (response.result) {
        onPromptGenerated(response.result);
        toast.success(isVariation ? 'New variation created' : 'Prompt generated');
        setHasGenerated(true); // Show the info note
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
            <strong>Note:</strong> if the results appear deformed or unsatisfactory, click "<span className="font-semibold">New Variation</span>" to refresh and generate a new prompt.
          </span>
        </div>
      )}
    </div>
  );
};

export default KeywordsToPrompt;
