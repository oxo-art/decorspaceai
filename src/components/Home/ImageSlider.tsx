import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Slider } from "@/components/ui/slider";
import { ChevronLeft, ChevronRight, RotateCcw, Maximize2, Play, Pause, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ImageSliderProps {
  beforeImage: string;
  afterImage: string;
  height?: string;
  width?: string;
  className?: string;
  beforeLabel?: string;
  afterLabel?: string;
  autoPlay?: boolean;
  autoPlaySpeed?: number;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ 
  beforeImage, 
  afterImage,
  height = "400px",
  width = "100%",
  className,
  beforeLabel = "Before",
  afterLabel = "After",
  autoPlay = false,
  autoPlaySpeed = 3000
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({ before: false, after: false });
  const [imageErrors, setImageErrors] = useState({ before: false, after: false });
  const [isHovered, setIsHovered] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'before' | 'after'>('split');
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleSliderChange = useCallback((value: number[]) => {
    setSliderPosition(value[0]);
  }, []);

  const resetPosition = useCallback(() => {
    setSliderPosition(50);
  }, []);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying(prev => !prev);
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
    setIsAutoPlaying(false); // Stop autoplay when dragging
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    
    let clientX: number;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    
    const rect = containerRef.current.getBoundingClientRect();
    const position = ((clientX - rect.left) / rect.width) * 100;
    
    setSliderPosition(Math.max(0, Math.min(100, position)));
  }, [isDragging]);

  const handleBeforeImageLoad = useCallback(() => {
    setImagesLoaded(prev => ({ ...prev, before: true }));
  }, []);

  const handleAfterImageLoad = useCallback(() => {
    setImagesLoaded(prev => ({ ...prev, after: true }));
  }, []);

  const handleBeforeImageError = useCallback(() => {
    setImageErrors(prev => ({ ...prev, before: true }));
  }, []);

  const handleAfterImageError = useCallback(() => {
    setImageErrors(prev => ({ ...prev, after: true }));
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && !isDragging && viewMode === 'split') {
      autoPlayIntervalRef.current = setInterval(() => {
        setSliderPosition(prev => {
          const newPos = prev + 1;
          if (newPos >= 100) return 0;
          return newPos;
        });
      }, autoPlaySpeed / 100);
    } else {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
        autoPlayIntervalRef.current = null;
      }
    }

    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    };
  }, [isAutoPlaying, isDragging, viewMode, autoPlaySpeed]);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setSliderPosition(prev => Math.max(0, prev - 5));
      } else if (e.key === 'ArrowRight') {
        setSliderPosition(prev => Math.min(100, prev + 5));
      } else if (e.key === 'r' || e.key === 'R') {
        resetPosition();
      } else if (e.key === ' ') {
        e.preventDefault();
        toggleAutoPlay();
      }
    };
    
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalMouseUp);
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [resetPosition, toggleAutoPlay]);

  const bothImagesLoaded = imagesLoaded.before && imagesLoaded.after;
  const hasErrors = imageErrors.before || imageErrors.after;
  
  const renderContent = () => {
    switch (viewMode) {
      case 'before':
        return (
          <img
            src={beforeImage}
            alt="Before transformation"
            className="w-full h-full object-cover transition-all duration-300"
            onLoad={handleBeforeImageLoad}
            onError={handleBeforeImageError}
          />
        );
      case 'after':
        return (
          <img
            src={afterImage}
            alt="After transformation"
            className="w-full h-full object-cover transition-all duration-300"
            onLoad={handleAfterImageLoad}
            onError={handleAfterImageError}
          />
        );
      default:
        return (
          <>
            {/* Before Image (Full width) */}
            <div className="absolute inset-0 w-full h-full">
              <img
                src={beforeImage}
                alt="Before transformation"
                className="w-full h-full object-cover"
                onLoad={handleBeforeImageLoad}
                onError={handleBeforeImageError}
              />
            </div>
            
            {/* After Image (Partial width based on slider) */}
            <div 
              className="absolute inset-0 h-full overflow-hidden transition-all duration-75"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={afterImage}
                alt="After transformation"
                className="absolute top-0 left-0 w-full h-full object-cover"
                style={{ 
                  width: `${100 / (sliderPosition / 100)}%`,
                  maxWidth: "none"
                }}
                onLoad={handleAfterImageLoad}
                onError={handleAfterImageError}
              />
            </div>
            
            {/* Enhanced Slider Divider Line */}
            <div 
              className={cn(
                "absolute top-0 bottom-0 w-1 cursor-ew-resize transition-all duration-200",
                "bg-gradient-to-b from-primary/80 via-primary to-primary/80",
                "shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_25px_hsl(var(--primary)/0.6)]",
                isDragging && "shadow-[0_0_30px_hsl(var(--primary)/0.8)]"
              )}
              style={{ 
                left: `${sliderPosition}%`, 
                marginLeft: "-2px",
                zIndex: 20
              }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
            >
              <div className={cn(
                "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
                "glass-card hover:scale-110 cursor-grab active:cursor-grabbing",
                isDragging && "scale-110 shadow-lg"
              )}>
                <ChevronLeft className="w-3 h-3 text-primary -mr-0.5" />
                <ChevronRight className="w-3 h-3 text-primary -ml-0.5" />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div 
      className={cn(
        "relative w-full h-full glass-card overflow-hidden group transition-all duration-300",
        isFullscreen && "fixed inset-4 z-50 rounded-2xl",
        className
      )} 
      style={{ height: isFullscreen ? 'calc(100vh - 2rem)' : height, width }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
    >
      {/* Loading State */}
      {!bothImagesLoaded && !hasErrors && (
        <div className="absolute inset-0 flex items-center justify-center glassmorphism z-30">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-sm text-muted-foreground font-medium">Loading images...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasErrors && (
        <div className="absolute inset-0 flex items-center justify-center glassmorphism z-30">
          <div className="text-center space-y-2">
            <p className="text-destructive font-semibold">Failed to load images</p>
            <p className="text-sm text-muted-foreground">Please check your image URLs</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div 
        ref={containerRef}
        className="relative w-full h-full"
        style={{ opacity: bothImagesLoaded && !hasErrors ? 1 : 0 }}
      >
        {renderContent()}
        
        {/* Enhanced Labels with Badges */}
        {viewMode === 'split' && (
          <>
            <Badge 
              variant="secondary"
              className={cn(
                "absolute top-4 left-4 transition-all duration-300 backdrop-blur-sm",
                "border border-border/50 text-xs font-semibold px-3 py-1",
                sliderPosition <= 15 ? "opacity-0 scale-95" : "opacity-100 scale-100"
              )}
            >
              {beforeLabel}
            </Badge>
            <Badge 
              variant="secondary"
              className={cn(
                "absolute top-4 right-4 transition-all duration-300 backdrop-blur-sm",
                "border border-border/50 text-xs font-semibold px-3 py-1",
                sliderPosition >= 85 ? "opacity-0 scale-95" : "opacity-100 scale-100"
              )}
            >
              {afterLabel}
            </Badge>
          </>
        )}

        {/* Single Image Label */}
        {viewMode !== 'split' && (
          <Badge 
            variant="secondary"
            className="absolute top-4 left-4 backdrop-blur-sm border border-border/50 text-xs font-semibold px-3 py-1"
          >
            {viewMode === 'before' ? beforeLabel : afterLabel}
          </Badge>
        )}
      </div>
      
      {/* Enhanced Controls Panel */}
      {bothImagesLoaded && !hasErrors && (
        <div className={cn(
          "absolute bottom-4 left-4 right-4 transition-all duration-300",
          isHovered || isDragging || isAutoPlaying ? "opacity-100 translate-y-0" : "opacity-80 translate-y-2"
        )}>
          {/* Main Slider (only in split mode) */}
          {viewMode === 'split' && (
            <div className="mb-4">
              <Slider
                value={[sliderPosition]}
                min={0}
                max={100}
                step={0.5}
                onValueChange={handleSliderChange}
                className="w-full"
              />
            </div>
          )}
          
          {/* Control Buttons */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 glass-card p-1 rounded-lg">
                <Button
                  size="sm"
                  variant={viewMode === 'split' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('split')}
                  className="h-8 px-3 text-xs"
                >
                  Split
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'before' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('before')}
                  className="h-8 px-3 text-xs"
                >
                  Before
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'after' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('after')}
                  className="h-8 px-3 text-xs"
                >
                  After
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* AutoPlay Button (only in split mode) */}
              {viewMode === 'split' && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={toggleAutoPlay}
                  className="h-8 w-8 p-0 glass-card"
                >
                  {isAutoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              )}
              
              {/* Reset Button (only in split mode) */}
              {viewMode === 'split' && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={resetPosition}
                  className="h-8 w-8 p-0 glass-card"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
              
              {/* Fullscreen Button */}
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleFullscreen}
                className="h-8 w-8 p-0 glass-card"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Position Indicator */}
      {viewMode === 'split' && bothImagesLoaded && !hasErrors && (
        <div className={cn(
          "absolute top-4 left-1/2 transform -translate-x-1/2 transition-all duration-300",
          isHovered || isDragging ? "opacity-100" : "opacity-0"
        )}>
          <Badge variant="outline" className="backdrop-blur-sm text-xs font-mono">
            {Math.round(sliderPosition)}%
          </Badge>
        </div>
      )}

      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={toggleFullscreen}
        />
      )}
    </div>
  );
};

export default ImageSlider;