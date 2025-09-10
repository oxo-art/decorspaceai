
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import InputSection from '@/components/InteriorDesign/InputSection';
import OutputSection from '@/components/InteriorDesign/OutputSection';
import { supabase } from '@/integrations/supabase/client';

import Navbar from '@/components/Home/Navbar';

const Index = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Update page title for SEO
  useEffect(() => {
    document.title = 'AI Interior Design Tool - Create Your Dream Space | Decorspace AI';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Use our AI-powered interior design tool to transform any room. Upload your photo, describe your vision, and get professional design results instantly.');
    }
  }, []);

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
      console.log("Generating design with:", { prompt, image });
      
      // Call Supabase Edge Function to generate interior design
      const response = await supabase.functions.invoke('generate-interior-design', {
        body: {
          prompt: prompt,
          imageInput: [image], // Pass the base64 image
          outputFormat: 'jpg'
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to generate design');
      }

      if (response.data?.success && response.data?.imageUrl) {
        setOutput(response.data.imageUrl);
        toast.success('Design generated successfully!');
      } else {
        throw new Error('No image URL received from AI service');
      }
      
    } catch (error) {
      console.error('Error generating design:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(`Failed to generate design: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-background">
      <Navbar />
      
      <div className="pt-24 pb-8 px-2 sm:px-4 md:px-6 lg:px-8 w-full max-w-6xl mx-auto flex-grow opacity-0 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
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
