
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
    <div className="glass-navbar w-full fixed top-0 z-20">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Left side - Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity duration-300">
            <img 
              src="/logo.svg" 
              alt="Interior AI Design - Home" 
              className="h-12 w-auto object-contain"
            />
          </Link>
        </div>
        
        {/* Center - Empty space where logo was */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          {/* Logo removed */}
        </div>
        
        {/* Right side - Hamburger menu */}
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-2 glass-button hover:shadow-glow transition-all duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6 text-black" />
          </Button>
        </div>
      </div>
      
      {/* Mobile menu dropdown */}
      {isMenuOpen && (
        <div className="bg-card py-4 px-6 absolute w-full animate-fade-in z-20 border-t border-border shadow-lg">
          <nav className="flex flex-col space-y-3">
            <Link 
              to="/" 
              className="text-foreground hover:text-primary transition-colors hover:drop-shadow-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/design" 
              className="text-foreground hover:text-primary transition-colors hover:drop-shadow-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Design Tool
            </Link>
            <Link 
              to="/about" 
              className="text-foreground hover:text-primary transition-colors hover:drop-shadow-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <button 
              className="text-left text-foreground hover:text-primary transition-colors hover:drop-shadow-lg"
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
