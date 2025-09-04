
import { Card } from '@/components/ui/card';
import ResultDisplay from './ResultDisplay';
import { PartyPopper } from 'lucide-react';

interface OutputSectionProps {
  isLoading: boolean;
  output: string | null;
  inputImage: string | null;
}

const OutputSection: React.FC<OutputSectionProps> = ({ 
  isLoading, 
  output, 
  inputImage 
}) => {
  return (
    <div className="space-y-4 md:space-y-6 animate-scale-in" style={{ animationDelay: '0.2s' }}>
      <Card className="glassmorphism-light overflow-hidden hover:glassmorphism-medium transition-all duration-300">
        <div className="p-3 md:p-4">
          <h2 className="text-lg md:text-xl font-medium mb-3 md:mb-4 flex items-center gap-2">
            <PartyPopper className="h-4 w-4 md:h-5 md:w-5 text-yellow-500" /> Design
          </h2>
          <ResultDisplay 
            isLoading={isLoading} 
            output={output}
          />
        </div>
      </Card>
    </div>
  );
};

export default OutputSection;
