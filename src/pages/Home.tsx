import React from 'react';
import Navbar from '@/components/Home/Navbar';
import { Link } from 'react-router-dom';
import ImageSlider from '@/components/Home/ImageSlider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HomeIcon, Keyboard, Wand2, Star, Mail } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section - Starts below the navbar */}
      <div className="pt-24 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-volkhov text-gunmetal font-bold mb-4">
            Transform Your Living Space with AI
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mb-8">
            Experience the power of AI to reimagine and enhance your interior spaces with just a few clicks.
            Upload a photo of your room and get stunning design transformations instantly.
          </p>
          
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full max-w-4xl mb-8">
            {/* Before/After Image Slider */}
            <div className="aspect-video w-full mb-6">
              <ImageSlider 
                beforeImage="/lovable-uploads/bd34ac83-6bda-4860-a7c1-597175c2e137.png"
                afterImage="/lovable-uploads/67b8d15c-8ea6-4834-8161-c855e9e18edf.png"
                height="100%"
                width="100%"
              />
            </div>
            
            <Link 
              to="/design" 
              className="inline-block w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-3 px-4 rounded-md text-center transition-colors"
            >
              Start Designing Now
            </Link>
          </div>

          {/* How It Works Section */}
          <div className="w-full max-w-4xl mt-12">
            <h2 className="text-3xl font-volkhov text-gunmetal font-bold mb-8 text-center">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <HomeIcon className="h-6 w-6 text-yellow-500" />
                    Upload Your Space
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <img 
                      src="/lovable-uploads/6eb8c29f-c0e4-4d6e-9128-d41302fcdf02.png"
                      alt="Room photo example" 
                      className="w-full rounded-lg shadow-sm"
                    />
                  </div>
                  <p className="text-gray-600">
                    Take a photo of the room you want to design and upload it to our platform.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Keyboard className="h-6 w-6 text-yellow-500" />
                    Describe your dream interior
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <img 
                      src="/lovable-uploads/579e3acf-8c33-4d0a-b885-e9c28c09e91d.png"
                      alt="Prompt example" 
                      className="w-full rounded-lg shadow-sm border border-gray-200"
                    />
                  </div>
                  <p className="text-gray-600">
                    Describe the interior design which you want, type it in the prompt field and click on generate.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Wand2 className="h-6 w-6 text-yellow-500" />
                    AI Transformation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <img 
                      src="/lovable-uploads/768e5239-2338-4f15-b125-86f67c3a977b.png"
                      alt="AI transformed room" 
                      className="w-full rounded-lg shadow-sm"
                    />
                  </div>
                  <p className="text-gray-600">
                    Our AI takes a few seconds and generates a stunning design of your space.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="w-full max-w-4xl mt-16 mb-16">
            <h2 className="text-3xl font-volkhov text-gunmetal font-bold mb-8 text-center">
              What Our Customers Say
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Testimonial 1 */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12 border-2 border-yellow-200">
                      <AvatarImage src="/lovable-uploads/ae68b5d0-b4d1-4602-87b2-540dd58e0c80.png" alt="Sophie Chen" />
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">Sophie Chen</h3>
                      <p className="text-sm text-muted-foreground">Interior Designer</p>
                    </div>
                    <div className="ml-auto flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 italic">
                    "As an interior designer, this tool is a game-changer for visualizing concepts quickly. I can show clients multiple design directions without creating full mood boards. It's become essential for my initial client presentations."
                  </p>
                </CardContent>
              </Card>

              {/* Testimonial 2 */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12 border-2 border-yellow-200">
                      <AvatarImage src="/lovable-uploads/c1da7f79-5457-4663-95f5-025298e8f5a5.png" alt="Marcus Johnson" />
                      <AvatarFallback>MJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">Marcus Johnson</h3>
                      <p className="text-sm text-muted-foreground">Architect</p>
                    </div>
                    <div className="ml-auto flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 italic">
                    "The spatial awareness of this AI is remarkable. I use it to help clients visualize how architectural changes might look before we commit to detailed renders. Saves me hours of work on preliminary designs."
                  </p>
                </CardContent>
              </Card>

              {/* Testimonial 3 */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12 border-2 border-yellow-200">
                      <AvatarImage src="/lovable-uploads/e5cf5be6-d84f-4606-bfbb-f6fcaa3738a7.png" alt="Priya Sharma" />
                      <AvatarFallback>PS</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">Priya Sharma</h3>
                      <p className="text-sm text-muted-foreground">Home Stager</p>
                    </div>
                    <div className="ml-auto flex">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <Star className="h-4 w-4 text-gray-300" />
                    </div>
                  </div>
                  <p className="text-gray-600 italic">
                    "This tool has revolutionized how I prepare properties for sale. I can show potential buyers how their space could look with proper staging, which helps me win more contracts. The results are incredibly realistic."
                  </p>
                </CardContent>
              </Card>
              
              {/* Testimonial 4 */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12 border-2 border-yellow-200">
                      <AvatarImage src="/lovable-uploads/be650492-5527-4cbb-9b07-03f33138eef3.png" alt="Emma Reynolds" />
                      <AvatarFallback>ER</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">Emma Reynolds</h3>
                      <p className="text-sm text-muted-foreground">Real Estate Agent</p>
                    </div>
                    <div className="ml-auto flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 italic">
                    "This AI design tool has completely transformed my real estate business. Now I can show clients the potential of any property by visualizing different design styles before they even make an offer. My listings sell faster thanks to these realistic visualizations."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Contact Us Section - Simplified version */}
          <div id="contact" className="w-full max-w-4xl mt-8 mb-16">
            <h2 className="text-4xl font-volkhov text-gunmetal font-bold mb-4 text-center">
              Contact Us
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mb-12 text-center">
              Have questions about our AI design services? Reach out to our team and we'll be happy to help.
            </p>
            
            <div className="w-full flex justify-center mb-8">
              <Card className="max-w-md w-full hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <CardTitle className="flex flex-col items-center gap-3">
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-yellow-500" />
                    </div>
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">
                    <a href="mailto:contact@decorspaceai.com" className="text-yellow-500 hover:underline">
                      contact@decorspaceai.com
                    </a>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
