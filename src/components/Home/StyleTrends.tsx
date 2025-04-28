
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';

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

const COLORS = ['#EAB308', '#F59E0B', '#D97706', '#B45309'];

const StyleTrends = () => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-16">
      <h2 className="text-3xl font-volkhov text-gunmetal font-bold mb-8 text-center">
        Interior Style Trends
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Popular Styles */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4 text-center">Popular Styles</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={styleData} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="value" fill="#EAB308" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Room Distribution */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4 text-center">Room Distribution</h3>
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
                >
                  {roomData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StyleTrends;
