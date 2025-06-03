
import React, { useState } from 'react';
import { toast } from 'sonner';
import InputSection from '@/components/InteriorDesign/InputSection';
import OutputSection from '@/components/InteriorDesign/OutputSection';
import { transformImage } from '@/services/replicateService';
import { generateImageWithOpenAI } from '@/services/openaiService';
import Navbar from '@/components/Home/Navbar';

const Index = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [modelType] = useState<"interiorDesign">("interiorDesign");
  const [useOpenAI, setUseOpenAI] = useState(false); // Toggle between OpenAI and Replicate
  const [advancedSettings, setAdvancedSettings] = useState({
    guidance_scale: 15,
    prompt_strength: 1,
    num_inference_steps: 100  // Explicitly set to 100 as default
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    
    setOutput(null);
    setIsLoading(true);
    
    try {
      let result;
      
      if (useOpenAI || !image) {
        // Use OpenAI's new image generation when no image is uploaded or OpenAI is selected
        result = await generateImageWithOpenAI(prompt);
        
        if (result.result && result.type === 'image') {
          setOutput(result.result);
          toast.success('Image generated successfully!');
        } else {
          toast.error('Failed to generate image');
        }
      } else {
        // Use existing Replicate service when image is uploaded
        result = await transformImage({
          prompt,
          image: image,
          model: modelType,
          guidance_scale: advancedSettings.guidance_scale,
          prompt_strength: advancedSettings.prompt_strength,
          num_inference_steps: advancedSettings.num_inference_steps
        });
        
        if (result.output) {
          setOutput(result.output);
          toast.success('Image transformed successfully!');
        } else {
          toast.error('Failed to transform image');
        }
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="pt-24 px-2 sm:px-4 md:px-6 lg:px-8 w-full max-w-6xl mx-auto flex-grow animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
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
            useOpenAI={useOpenAI}
            setUseOpenAI={setUseOpenAI}
          />
          
          <OutputSection 
            isLoading={isLoading}
            output={output}
            inputImage={image}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
