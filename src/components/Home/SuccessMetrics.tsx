import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Users, Clock, Star } from 'lucide-react';

const timeData = [
  { name: 'Traditional', hours: 48 },
  { name: 'With AI', hours: 1 },
];

const SuccessMetrics = () => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-16">
      <h2 className="text-3xl font-volkhov text-gunmetal font-bold mb-8 text-center animate-fade-in">
        Our Impact
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-white via-yellow-50 to-amber-50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 mb-4 animate-scale-in">
                <CircularProgressbar
                  value={98}
                  text={`${98}%`}
                  styles={buildStyles({
                    textSize: '1rem',
                    pathColor: '#F97316',
                    textColor: '#122C34',
                    pathTransition: 'stroke-dashoffset 0.5s ease 0s',
                    trailColor: '#F3F4F6',
                  })}
                />
              </div>
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <Star className="text-amber-600" /> Success Rate
              </h3>
              <p className="text-sm text-gray-600 text-center">
                Client satisfaction with AI-generated designs
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-white via-yellow-50 to-amber-50">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4 text-center flex items-center justify-center gap-2">
              <Clock className="text-amber-600" /> Time Savings
            </h3>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={timeData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #F97316',
                    borderRadius: '8px',
                  }}
                />
                <Bar 
                  dataKey="hours" 
                  fill="url(#timeGradient)"
                  className="animate-fade-in"
                >
                  <defs>
                    <linearGradient id="timeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F97316" />
                      <stop offset="100%" stopColor="#FCD34D" />
                    </linearGradient>
                  </defs>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 text-center mt-4">
              Hours saved in design visualization
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-white via-yellow-50 to-amber-50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-amber-600 mb-4 animate-scale-in flex items-center gap-2">
                <Users className="text-amber-600" />
                50K+
              </div>
              <h3 className="text-lg font-medium mb-2">Rooms Transformed</h3>
              <p className="text-sm text-gray-600 text-center">
                Successful interior transformations
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuccessMetrics;
