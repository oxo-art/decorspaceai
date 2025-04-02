
import React from 'react';
import Navbar from '@/components/Home/Navbar';
import { Link } from 'react-router-dom';
import ImageSlider from '@/components/Home/ImageSlider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HomeIcon, Keyboard, Wand2, Star } from 'lucide-react';
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
                      <AvatarImage src="/lovable-uploads/6f3792db-c16f-42f9-919f-03113887daae.png" alt="Sophie Chen" />
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
                      <AvatarImage src="/lovable-uploads/5136968e-e959-4ee7-96ab-e2bdd5a183ad.png" alt="Marcus Johnson" />
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
                      <AvatarImage src="/lovable-uploads/1b84c0df-9209-423d-94c0-cb57a7e8bdfe.png" alt="Priya Sharma" />
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
                    "This tool has revolutionized how I prepare properties for sale. I can show potential sellers how their space could look with proper staging, which helps me win more contracts. The results are incredibly realistic."
                  </p>
                </CardContent>
              </Card>

              {/* Testimonial 4 */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12 border-2 border-yellow-200">
                      <AvatarImage src="/lovable-uploads/33a8770c-a08b-4e70-bea1-af85d43c01e6.png" alt="David Liu" />
                      <AvatarFallback>DL</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">David Liu</h3>
                      <p className="text-sm text-muted-foreground">Real Estate Developer</p>
                    </div>
                    <div className="ml-auto flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 italic">
                    "We use this AI tool for our pre-construction marketing materials. It allows potential buyers to visualize the finished spaces before we've even broken ground. The ROI has been phenomenal."
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
