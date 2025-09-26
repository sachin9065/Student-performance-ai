'use client';

import { Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { Student } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';

interface StudentChartsProps {
  students: Student[];
}

const attendancePerformanceConfig = {
  attendance: { label: 'Attendance %', color: 'hsl(var(--chart-1))' },
  performance: { label: 'Performance %', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig;

const riskDistributionConfig = {
  low: { label: 'Low Risk', color: 'hsl(var(--chart-1))' },
  medium: { label: 'Medium Risk', color: 'hsl(var(--chart-4))' },
  high: { label: 'High Risk', color: 'hsl(var(--destructive))' },
} satisfies ChartConfig;

export function StudentCharts({ students }: StudentChartsProps) {
  const chartData = students.map(s => ({
    name: s.name,
    attendance: s.attendancePercent,
    performance: s.previousMarks,
  })).slice(0, 20); // Show top 20 for readability

  const riskData = [
    { name: 'Low Risk', value: students.filter(s => s.riskScore !== undefined && s.riskScore <= 0.4).length, fill: 'var(--color-low)' },
    { name: 'Medium Risk', value: students.filter(s => s.riskScore !== undefined && s.riskScore > 0.4 && s.riskScore <= 0.75).length, fill: 'var(--color-medium)' },
    { name: 'High Risk', value: students.filter(s => s.riskScore !== undefined && s.riskScore > 0.75).length, fill: 'var(--color-high)' },
  ];

  if (students.length === 0) {
    return <div className="text-center text-muted-foreground py-8">No student data available to display charts.</div>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
        <div className="h-[400px]">
            <h3 className="font-semibold mb-2 text-center font-headline">Attendance vs Performance (Recent Students)</h3>
            <ResponsiveContainer width="100%" height="100%">
            <ChartContainer config={attendancePerformanceConfig}>
                <BarChart data={chartData} accessibilityLayer>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} hide />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="attendance" fill="var(--color-attendance)" radius={4} />
                    <Bar dataKey="performance" fill="var(--color-performance)" radius={4} />
                </BarChart>
            </ChartContainer>
            </ResponsiveContainer>
        </div>
        <div className="h-[400px]">
            <h3 className="font-semibold mb-2 text-center font-headline">Risk Score Distribution</h3>
            <ResponsiveContainer width="100%" height="100%">
                <ChartContainer config={riskDistributionConfig}>
                <PieChart>
                    <Tooltip content={<ChartTooltipContent nameKey="name" />} />
                    <Pie data={riskData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} label>
                        {riskData.map((entry) => (
                            <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                        ))}
                    </Pie>
                    <Legend />
                </PieChart>
                </ChartContainer>
            </ResponsiveContainer>
        </div>
    </div>
  );
}
