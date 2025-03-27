
import { Link } from "react-router-dom";
import { Menu, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <div className="bg-white w-full shadow-sm fixed top-0 z-10">
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
          <img 
            src="/lovable-uploads/37d0ffa0-0417-431c-8ecc-ccdd2cf2e2b4.png" 
            alt="DecorspaceAI Logo" 
            className="h-16 md:h-20 object-contain" 
          />
        </div>
        
        {/* Right side - Get Started button */}
        <div>
          <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black">
            <Link to="/design" className="flex items-center gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Mobile menu dropdown */}
      {isMenuOpen && (
        <div className="bg-white shadow-md py-4 px-6 absolute w-full animate-fade-in">
          <nav className="flex flex-col space-y-3">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-yellow-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/design" 
              className="text-gray-700 hover:text-yellow-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Design Tool
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-yellow-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-yellow-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Navbar;
