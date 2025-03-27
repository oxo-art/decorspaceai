
import { Link } from "react-router-dom";
import { Menu, ArrowRight, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <div className="bg-white w-full shadow-sm fixed top-0 z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left side - Hamburger menu and Get Started */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          
          <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black">
            <Link to="/design" className="flex items-center gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        {/* Center - Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img 
            src="/lovable-uploads/8fdf5b7d-f01f-4e02-b120-2d7f0c3a0b4d.png" 
            alt="Decorspace AI Logo" 
            className="h-14 object-contain"
          />
        </div>
        
        {/* Right side - Login button */}
        <div className="flex gap-2">
          <Button asChild variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-50">
            <Link to="/login" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" /> Login
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
              to="/login" 
              className="text-gray-700 hover:text-yellow-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Navbar;
