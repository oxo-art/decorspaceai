
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const isMobile = useIsMobile();
  
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleLogoError = () => {
    setLogoError(true);
  };
  
  return (
    <div className="bg-background w-full shadow-sm fixed top-0 z-20">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Left side - Hamburger menu */}
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        
        {/* Center - Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          {!logoError ? (
            <img 
              src="/lovable-uploads/37d0ffa0-0417-431c-8ecc-ccdd2cf2e2b4.png" 
              alt="DecorspaceAI Logo" 
              className="h-20 object-contain" 
              onError={handleLogoError}
            />
          ) : (
            <div className="h-20 flex items-center justify-center">
              <span className="text-2xl font-bold text-foreground">DecorspaceAI</span>
            </div>
          )}
        </div>
        
        {/* Right side - Removed theme toggle button */}
        <div className="flex items-center">
          {/* Intentionally left empty to maintain layout */}
        </div>
      </div>
      
      {/* Mobile menu dropdown */}
      {isMenuOpen && (
        <div className="bg-background shadow-md py-4 px-6 absolute w-full animate-fade-in z-20">
          <nav className="flex flex-col space-y-3">
            <Link 
              to="/" 
              className="text-foreground hover:text-terracotta transition-colors font-montserrat"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/design" 
              className="text-foreground hover:text-terracotta transition-colors font-montserrat"
              onClick={() => setIsMenuOpen(false)}
            >
              Design Tool
            </Link>
            <Link 
              to="/about" 
              className="text-foreground hover:text-terracotta transition-colors font-montserrat"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <button 
              className="text-left text-foreground hover:text-terracotta transition-colors font-montserrat"
              onClick={scrollToContact}
            >
              Contact
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Navbar;
