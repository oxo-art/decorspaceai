import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/Home/Navbar';
import { Palette, Lightbulb, Users, Target } from 'lucide-react';

const About = () => {
  // Update page title for SEO
  useEffect(() => {
    document.title = 'About Us - AI Interior Design Innovation | Decorspace AI';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn about Decorspace AI - we\'re revolutionizing interior design with cutting-edge AI technology, making beautiful spaces accessible to everyone.');
    }
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-background"
         style={{
           backgroundImage: 'var(--gradient-background), var(--cyber-grid)',
           backgroundSize: 'cover, 50px 50px'
         }}>
      <Navbar />
      
      <div className="pt-24 px-4 md:px-6 lg:px-8 w-full max-w-6xl mx-auto flex-grow">
        <div className="space-y-16">
          {/* Hero Section */}
          <section className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
              About Our AI Design Studio
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              We're revolutionizing interior design with cutting-edge AI technology, 
              making beautiful spaces accessible to everyone.
            </p>
          </section>

          {/* Mission Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-primary">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                We believe that everyone deserves to live in a space that inspires them. 
                Our AI-powered interior design platform democratizes professional design, 
                making it possible for anyone to transform their space with just a photo and a dream.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By combining advanced artificial intelligence with design expertise, 
                we're breaking down barriers and making professional interior design 
                accessible, affordable, and instant.
              </p>
            </div>
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <Palette className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">AI-Powered</h3>
                  <p className="text-sm text-muted-foreground">Advanced algorithms</p>
                </div>
                <div className="text-center">
                  <Lightbulb className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Innovative</h3>
                  <p className="text-sm text-muted-foreground">Cutting-edge tech</p>
                </div>
                <div className="text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Accessible</h3>
                  <p className="text-sm text-muted-foreground">For everyone</p>
                </div>
                <div className="text-center">
                  <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Precise</h3>
                  <p className="text-sm text-muted-foreground">Tailored results</p>
                </div>
              </div>
            </Card>
          </section>

          {/* How It Works */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-primary text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Upload Your Space</h3>
                <p className="text-muted-foreground">
                  Simply upload a photo of your room or space that you want to redesign.
                </p>
              </Card>
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Describe Your Vision</h3>
                <p className="text-muted-foreground">
                  Tell us your design preferences, style, and what you want to achieve.
                </p>
              </Card>
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">AI Magic</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes your space and creates a stunning transformation.
                </p>
              </Card>
            </div>
          </section>

          {/* Values */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-primary text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-3">Innovation</h3>
                <p className="text-muted-foreground">
                  We're constantly pushing the boundaries of what's possible with AI and design technology.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-3">Accessibility</h3>
                <p className="text-muted-foreground">
                  Design should be available to everyone, regardless of budget or experience level.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-3">Quality</h3>
                <p className="text-muted-foreground">
                  Every generated design meets professional standards of aesthetics and functionality.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-3">Sustainability</h3>
                <p className="text-muted-foreground">
                  We promote sustainable design practices and environmentally conscious choices.
                </p>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;