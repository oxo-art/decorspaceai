
import React, { useState } from 'react';
import { toast } from 'sonner';
import InputSection from '@/components/InteriorDesign/InputSection';
import OutputSection from '@/components/InteriorDesign/OutputSection';
import { transformImage } from '@/services/replicateService';

const Index = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [modelType] = useState<"interiorDesign">("interiorDesign");
  const [advancedSettings, setAdvancedSettings] = useState({
    guidance_scale: 15,
    prompt_strength: 1,
    num_inference_steps: 100
  });

  const handleGenerate = async () => {
    if (!image) {
      toast.error('Please upload an image first');
      return;
    }
    
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    
    // Clear the current output first to ensure UI refresh
    setOutput(null);
    setIsLoading(true);
    
    try {
      const result = await transformImage({
        prompt,
        image: image,
        model: modelType,
        guidance_scale: advancedSettings.guidance_scale,
        prompt_strength: advancedSettings.prompt_strength,
        num_inference_steps: advancedSettings.num_inference_steps
      });
      
      if (result.output) {
        // Force a re-render by setting a new state value
        setOutput(result.output + "?v=" + new Date().getTime());
        toast.success('Image transformed successfully!');
      } else {
        toast.error('Failed to transform image');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl animate-fade-in">
        <div className="bg-yellow-50 p-6 rounded-lg mb-8 shadow-sm border border-yellow-100">
          <h1 className="text-3xl md:text-4xl font-volkhov text-gunmetal text-center mb-2 tracking-tight">
            Decorspace <span className="font-semibold">AI</span>
          </h1>
          <p className="text-muted-foreground text-center">
            Transform your interior spaces with AI-powered design suggestions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InputSection
            image={image}
            setImage={setImage}
            prompt={prompt}
            setPrompt={setPrompt}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            setOutput={setOutput}
            advancedSettings={advancedSettings}
            setAdvancedSettings={setAdvancedSettings}
            isLoading={isLoading}
            handleGenerate={handleGenerate}
          />
          
          <OutputSection 
            isLoading={isLoading}
            output={output}
            inputImage={image}
          />
        </div>
        
        <p className="text-sm text-muted-foreground text-center mt-8">
          Powered by AI to transform and enhance your interior spaces.
        </p>
      </div>
    </div>
  );
};

export default Index;
