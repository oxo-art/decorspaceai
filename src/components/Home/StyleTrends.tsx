import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { GridIcon, HomeIcon } from 'lucide-react';

const styleData = [
  { name: 'Modern', value: 35 },
  { name: 'Minimalist', value: 25 },
  { name: 'Scandinavian', value: 20 },
  { name: 'Industrial', value: 15 },
];

const roomData = [
  { name: 'Living Room', value: 40 },
  { name: 'Bedroom', value: 30 },
  { name: 'Kitchen', value: 20 },
  { name: 'Office', value: 10 },
];

const COLORS = ['#F97316', '#FCD34D', '#FEF08A', '#64748b'];

const StyleTrends = () => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-16">
      <h2 className="text-3xl font-volkhov text-gunmetal font-bold mb-8 text-center animate-fade-in">
        Interior Style Trends
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-white via-yellow-50 to-amber-50">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4 text-center flex items-center justify-center gap-2">
              <GridIcon className="text-amber-600" /> Popular Styles
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={styleData} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #F97316',
                    borderRadius: '8px',
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="url(#barGradient)"
                  className="animate-fade-in"
                >
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#F97316" />
                      <stop offset="100%" stopColor="#FCD34D" />
                    </linearGradient>
                  </defs>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-white via-yellow-50 to-amber-50">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4 text-center flex items-center justify-center gap-2">
              <HomeIcon className="text-amber-600" /> Room Distribution
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={roomData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  className="animate-fade-in"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {roomData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      className="hover:opacity-80 transition-opacity"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #0D9488',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StyleTrends;
