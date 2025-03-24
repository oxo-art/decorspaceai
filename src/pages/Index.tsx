
import React, { useState, useRef, useEffect } from 'react';
import { Upload, Image, Key } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { transformImage } from '@/services/replicateService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const Index = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [modelType, setModelType] = useState<"imageToImage" | "interiorDesign">("imageToImage");
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if we need to show the API key dialog on component mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem('REPLICATE_API_KEY');
    if (!import.meta.env.VITE_REPLICATE_API_KEY && !storedApiKey) {
      setShowApiKeyDialog(true);
    }
  }, []);

  const handleApiKeySave = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }
    
    localStorage.setItem('REPLICATE_API_KEY', apiKey.trim());
    setShowApiKeyDialog(false);
    toast.success('API key saved successfully');
  };

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImage(e.target.result as string);
        setOutput(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleGenerate = async () => {
    if (!image) {
      toast.error('Please upload an image first');
      return;
    }
    
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await transformImage({
        prompt,
        image,
        model: modelType
      });
      
      if (result.output) {
        setOutput(result.output);
        toast.success('Image transformed successfully!');
      } else {
        toast.error('Failed to transform image');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      
      // Check for the specific error to show the API key dialog
      if (error.message === 'REPLICATE_API_KEY_REQUIRED') {
        setShowApiKeyDialog(true);
      } else {
        toast.error(error.message || 'An error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-light text-center mb-2 tracking-tight">
          Image <span className="font-semibold">Transformer</span>
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          Upload an image, enter a prompt, and transform it with AI
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6 animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <Card className="overflow-hidden border border-gray-200 shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-medium mb-4">Input</h2>
                
                {/* Image Upload Area */}
                <div 
                  className={cn(
                    "file-drop-area h-64 mb-4",
                    isDragging && "active"
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                >
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                  />
                  
                  {image ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={image} 
                        alt="Uploaded" 
                        className="w-full h-full object-contain rounded-lg"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-lg">
                        <Button variant="secondary" size="sm" className="gap-2">
                          <Upload size={16} />
                          <span>Change Image</span>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="image-placeholder">
                      <div className="flex flex-col items-center text-gray-500">
                        <Upload size={32} className="mb-2 text-gray-400" />
                        <p className="text-sm font-medium mb-1">Drag and drop an image</p>
                        <p className="text-xs">or click to browse</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Model Type Selection */}
                <div className="space-y-2 mb-4">
                  <label htmlFor="model-type" className="text-sm font-medium">
                    Transformation Type
                  </label>
                  <Select 
                    value={modelType} 
                    onValueChange={(value) => setModelType(value as "imageToImage" | "interiorDesign")}
                  >
                    <SelectTrigger id="model-type">
                      <SelectValue placeholder="Select transformation type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="imageToImage">Standard Image Transform</SelectItem>
                      <SelectItem value="interiorDesign">Interior Design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Prompt Field */}
                <div className="space-y-2">
                  <label htmlFor="prompt" className="text-sm font-medium">
                    Prompt
                  </label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe how you want to transform the image..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="resize-none"
                    rows={3}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="p-4 flex justify-between items-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                  onClick={() => setShowApiKeyDialog(true)}
                >
                  <Key size={14} />
                  <span>Set API Key</span>
                </Button>
                
                <Button 
                  onClick={handleGenerate}
                  disabled={!image || !prompt.trim() || isLoading}
                  className="transition-all-300"
                >
                  {isLoading ? 'Transforming...' : 'Transform with AI'}
                </Button>
              </div>
            </Card>
          </div>
          
          {/* Output Section */}
          <div className="space-y-6 animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <Card className="overflow-hidden border border-gray-200 shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-medium mb-4">Output</h2>
                
                <div className="h-64 bg-gray-100 rounded-lg overflow-hidden">
                  {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full border-4 border-gray-300 border-t-primary animate-spin"></div>
                    </div>
                  ) : output ? (
                    <img 
                      src={output} 
                      alt="Output" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-muted-foreground text-sm">
                        AI-transformed image will appear here
                      </p>
                    </div>
                  )}
                </div>
                
                {output && (
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = output;
                        link.download = 'transformed-image.png';
                        link.click();
                      }}
                    >
                      Download
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground text-center mt-8">
          This app uses AI to transform your images based on your prompts.
        </p>
      </div>

      {/* API Key Dialog */}
      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Set Replicate API Key</DialogTitle>
            <DialogDescription>
              Enter your Replicate API key to use the image transformation functionality.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="apiKey" className="text-sm font-medium">
                Replicate API Key
              </label>
              <Input
                id="apiKey"
                type="password"
                placeholder="r8_..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                You can get your API key from <a href="https://replicate.com/account/api-tokens" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">replicate.com/account/api-tokens</a>
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApiKeyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleApiKeySave}>Save API Key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
