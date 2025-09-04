
import React, { useState } from 'react';
import { toast } from 'sonner';
import InputSection from '@/components/InteriorDesign/InputSection';
import OutputSection from '@/components/InteriorDesign/OutputSection';
// import { generateImage } from '@/services/aiService'; // Placeholder for future AI integration
import Navbar from '@/components/Home/Navbar';

const Index = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleGenerate = async () => {
    if (!image) {
      toast.error('Please upload an image first');
      return;
    }
    
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    
    setOutput(null);
    setIsLoading(true);
    
    try {
      // TODO: Replace with your new AI model integration
      console.log("AI model integration needed:", { prompt, image });
      toast.error('AI model not configured. Please integrate your preferred AI model.');
      
      // Placeholder for future AI integration
      /*
      const result = await generateImage({
        prompt,
        image: image
      });
      
      if (result.output) {
        setOutput(result.output);
        toast.success('Interior design transformation completed successfully!');
      } else {
        toast.error('Failed to transform image');
      }
      */
    } catch (error) {
      console.error('Error generating image:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(`Failed to transform image: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-background">
      <Navbar />
      
      <div className="pt-24 px-2 sm:px-4 md:px-6 lg:px-8 w-full max-w-6xl mx-auto flex-grow opacity-0 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          <InputSection
            image={image}
            setImage={setImage}
            prompt={prompt}
            setPrompt={setPrompt}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            setOutput={setOutput}
            isLoading={isLoading}
            handleGenerate={handleGenerate}
          />
          
          <OutputSection 
            isLoading={isLoading}
            output={output}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
