
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb, Loader2 } from 'lucide-react';
import { getAIDesignSuggestion } from '@/services/openaiService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';

interface AIPromptHelperProps {
  onSuggestionSelect: (suggestion: string) => void;
}

const AIPromptHelper: React.FC<AIPromptHelperProps> = ({ onSuggestionSelect }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [open, setOpen] = useState(false);

  const handleGetSuggestion = async () => {
    setIsLoading(true);
    try {
      const response = await getAIDesignSuggestion({
        prompt: "Generate a detailed and creative interior design prompt that I can use to transform a room. Include specific colors, furniture pieces, and style details. Make it descriptive and inspiring."
      });
      
      if (response.result) {
        setSuggestion(response.result);
      }
    } catch (error) {
      console.error("Error getting suggestion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSuggestion = () => {
    onSuggestionSelect(suggestion);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50"
          onClick={() => {
            if (!suggestion) {
              handleGetSuggestion();
            }
          }}
        >
          <Lightbulb className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>AI Design Prompt Suggestion</DialogTitle>
          <DialogDescription>
            Get inspired with an AI-generated interior design prompt
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {isLoading ? (
            <div className="flex items-center justify-center p-6">
              <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
            </div>
          ) : suggestion ? (
            <ScrollArea className="h-[200px] rounded-md border p-4">
              {suggestion}
            </ScrollArea>
          ) : (
            <div className="text-center p-6 text-muted-foreground">
              Click the button below to generate a suggestion
            </div>
          )}
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={handleGetSuggestion}
            disabled={isLoading}
            className="flex-1"
          >
            {suggestion ? "Generate Another" : "Generate Suggestion"}
          </Button>
          
          {suggestion && (
            <Button 
              onClick={handleSelectSuggestion}
              className="flex-1"
            >
              Use This Prompt
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIPromptHelper;
