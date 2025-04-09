
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
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
  const [lastKeywords, setLastKeywords] = useState('');
  const [variationCount, setVariationCount] = useState(0);

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
        prompt: `Create a detailed interior design description using these keywords: ${keywordsToUse}`,
        isVariation: isVariation
      });
      
      if (response.result) {
        onPromptGenerated(response.result);
        toast.success(isVariation ? 'New variation created' : 'Prompt generated');
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
  );
};

export default KeywordsToPrompt;
