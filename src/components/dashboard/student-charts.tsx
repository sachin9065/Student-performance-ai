
'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Scatter,
  ScatterChart,
  Line,
  LineChart,
} from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { Student } from '@/lib/types';
import { useMemo } from 'react';
import { format } from 'date-fns';

interface StudentChartsProps {
  students: Student[];
}

const chartConfig = {
  attendance: { label: 'Attendance %', color: 'hsl(var(--chart-1))' },
  performance: { label: 'Performance %', color: 'hsl(var(--chart-2))' },
  riskLow: { label: 'Low Risk', color: 'hsl(var(--chart-1))' },
  riskMedium: { label: 'Medium Risk', color: 'hsl(var(--chart-4))' },
  riskHigh: { label: 'High Risk', color: 'hsl(var(--destructive))' },
} satisfies ChartConfig;

export function StudentCharts({ students }: StudentChartsProps) {
  const scatterData = students.map((s) => ({
    name: s.name,
    attendance: s.attendancePercent,
    performance: s.previousMarks,
  }));

  const riskData = useMemo(() => {
    return [
      {
        name: 'Low Risk',
        value: students.filter(
          (s) => s.riskScore !== undefined && s.riskScore <= 0.4
        ).length,
        fill: 'var(--color-riskLow)',
      },
      {
        name: 'Medium Risk',
        value: students.filter(
          (s) =>
            s.riskScore !== undefined &&
            s.riskScore > 0.4 &&
            s.riskScore <= 0.75
        ).length,
        fill: 'var(--color-riskMedium)',
      },
      {
        name: 'High Risk',
        value: students.filter(
          (s) => s.riskScore !== undefined && s.riskScore > 0.75
        ).length,
        fill: 'var(--color-riskHigh)',
      },
    ];
  }, [students]);

  const performanceTrendData = useMemo(() => {
    const sortedStudents = [...students].sort((a, b) => a.createdAt - b.createdAt);
    return sortedStudents.map(student => ({
        date: format(new Date(student.createdAt), 'MMM yyyy'),
        performance: student.previousMarks,
    }));
  }, [students]);


  if (students.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No student data available to display charts.
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 h-[400px]">
        <h3 className="font-semibold mb-2 text-center font-headline">
          Attendance vs Performance Correlation
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <ChartContainer config={chartConfig}>
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid />
              <XAxis
                type="number"
                dataKey="attendance"
                name="Attendance"
                unit="%"
                label={{ value: 'Attendance (%)', position: 'insideBottom', offset: -10 }}
              />
              <YAxis
                type="number"
                dataKey="performance"
                name="Performance"
                unit="%"
                label={{ value: 'Performance (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent hideLabel />} />
              <Scatter name="Students" data={scatterData} fill="hsl(var(--chart-1))" />
            </ScatterChart>
          </ChartContainer>
        </ResponsiveContainer>
      </div>
      <div className="h-[400px]">
        <h3 className="font-semibold mb-2 text-center font-headline">
          Risk Score Distribution
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <ChartContainer config={chartConfig}>
            <PieChart>
              <Tooltip content={<ChartTooltipContent nameKey="name" />} />
              <Pie
                data={riskData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                label
              >
                {riskData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ChartContainer>
        </ResponsiveContainer>
      </div>
      <div className="lg:col-span-3 h-[400px]">
        <h3 className="font-semibold mb-2 text-center font-headline">
          Performance Trend Over Time
        </h3>
        <ResponsiveContainer width="100%" height="100%">
            <ChartContainer config={chartConfig}>
                <LineChart data={performanceTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} unit="%"/>
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="performance" stroke="var(--color-performance)" activeDot={{ r: 8 }} />
                </LineChart>
            </ChartContainer>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
