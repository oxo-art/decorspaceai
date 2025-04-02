
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Sophie Chen",
    role: "Interior Designer",
    avatar: "/lovable-uploads/6f3792db-c16f-42f9-919f-03113887daae.png",
    rating: 5,
    text: "As an interior designer, this tool is a game-changer for visualizing concepts quickly. I can show clients multiple design directions without creating full mood boards. It's become essential for my initial client presentations."
  },
  {
    name: "Marcus Johnson",
    role: "Architect",
    avatar: "/lovable-uploads/5136968e-e959-4ee7-96ab-e2bdd5a183ad.png",
    rating: 5,
    text: "The spatial awareness of this AI is remarkable. I use it to help clients visualize how architectural changes might look before we commit to detailed renders. Saves me hours of work on preliminary designs."
  },
  {
    name: "Priya Sharma",
    role: "Home Stager",
    avatar: "/lovable-uploads/1b84c0df-9209-423d-94c0-cb57a7e8bdfe.png",
    rating: 4,
    text: "This tool has revolutionized how I prepare properties for sale. I can show potential sellers how their space could look with proper staging, which helps me win more contracts. The results are incredibly realistic."
  },
  {
    name: "David Liu",
    role: "Real Estate Developer",
    avatar: "/lovable-uploads/33a8770c-a08b-4e70-bea1-af85d43c01e6.png",
    rating: 5,
    text: "We use this AI tool for our pre-construction marketing materials. It allows potential buyers to visualize the finished spaces before we've even broken ground. The ROI has been phenomenal."
  }
];

const TestimonialsSection = () => {
  return (
    <div className="w-full max-w-4xl mt-16 mb-16">
      <h2 className="text-3xl font-volkhov text-gunmetal font-bold mb-8 text-center">
        What Our Customers Say
      </h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12 border-2 border-yellow-200">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
                <div className="ml-auto flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 italic">
                "{testimonial.text}"
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;
