
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/button';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const scrollToContact = () => {
    // Close the mobile menu
    setMobileMenuOpen(false);
    
    // If we're on the home page, scroll to the contact section
    if (location.pathname === '/') {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If we're not on the home page, navigate to home and then scroll
      window.location.href = '/#contact';
    }
  };
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link to="/" className="flex items-center">
              <span className="ml-2 text-xl font-bold text-gray-900">DecorSpaceAI</span>
            </Link>
          </div>
          
          <div className="-mr-2 -my-2 md:hidden">
            <Button 
              variant="ghost"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </Button>
          </div>
          
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            <Link to="/design" className="whitespace-nowrap font-medium text-gray-500 hover:text-gray-900 py-2 px-3 inline-flex items-center">
              Design
            </Link>
            
            <a 
              href="#contact" 
              className="whitespace-nowrap font-medium text-gray-500 hover:text-gray-900 py-2 px-3 inline-flex items-center"
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault();
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Contact
            </a>
            
            <Link to="/design" className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-yellow-500 hover:bg-yellow-600">
              Start Design
            </Link>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden z-50">
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
            <div className="pt-5 pb-6 px-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold">DecorSpaceAI</span>
                </div>
                <div className="-mr-2">
                  <Button
                    variant="ghost"
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </Button>
                </div>
              </div>
              <div className="mt-6">
                <nav className="grid gap-y-8">
                  <Link 
                    to="/"
                    className="text-base font-medium text-gray-900 hover:text-yellow-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/design"
                    className="text-base font-medium text-gray-900 hover:text-yellow-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Design
                  </Link>
                  <a 
                    href="#contact"
                    className="text-base font-medium text-gray-900 hover:text-yellow-600" 
                    onClick={scrollToContact}
                  >
                    Contact
                  </a>
                </nav>
              </div>
            </div>
            <div className="py-6 px-5 space-y-6">
              <div>
                <Link
                  to="/design"
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-yellow-500 hover:bg-yellow-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Start Design
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
