
import { Link } from "react-router-dom";
import { Menu, User, LogOut, LogIn } from "lucide-react";
import houseLogo from "@/assets/house-logo.png";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, signOut, loading } = useAuth();
  const { toast } = useToast();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      toast({
        title: "Sign Out Error",
        description: "There was an error signing out. Please try again.",
        variant: "destructive",
      });
    }
    setIsMenuOpen(false);
  };
  
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };
  
  return (
    <div className="glass-navbar w-full fixed top-0 z-20">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Left side - Logo */}
        <div className="flex items-center ml-4">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity duration-300">
            <div className="flex items-center space-x-3">
              <div className="relative flex items-center">
                <img src={houseLogo} alt="Decorspaceai Logo" className="h-18 w-auto" />
              </div>
              <div className="flex flex-col">
                <span className="text-foreground font-serif text-2xl font-bold tracking-wide">Decorspaceai</span>
              </div>
            </div>
          </Link>
        </div>
        
        {/* Center - Empty space where logo was */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          {/* Logo removed */}
        </div>
        
        {/* Right side - Auth and Menu */}
        <div className="flex items-center gap-2">
          {!loading && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                        <AvatarFallback>
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.email}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.user_metadata?.full_name || 'User'}
                        </p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/credits" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Credits</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="sm" asChild className="glass-button">
                  <Link to="/auth">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Link>
                </Button>
              )}
            </>
          )}
          
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
        <div className="bg-card/95 backdrop-blur-md py-4 px-6 absolute w-full animate-fade-in z-20 border-t border-border shadow-lg">
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
