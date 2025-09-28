'use client';

import { useState, useMemo } from 'react';
import type { Student } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, Loader2, BrainCircuit } from 'lucide-react';
import { generateStudentReport } from '@/ai/flows/generate-student-report-flow';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip, BarChart, XAxis, YAxis, Bar, CartesianGrid } from 'recharts';
import Papa from 'papaparse';

interface ReportGeneratorProps {
  allStudents: Student[];
}

export function ReportGenerator({ allStudents }: ReportGeneratorProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState<string>('');
  const { toast } = useToast();

  const classAverages = useMemo(() => {
    const total = allStudents.length;
    if (total === 0) return {
        avgAttendance: 0,
        avgStudyHours: 0,
        avgPreviousMarks: 0,
        avgAssignmentsScore: 0,
        avgParticipationScore: 0,
        avgExtraCurricularScore: 0,
    };

    const sums = allStudents.reduce((acc, s) => ({
      attendance: acc.attendance + s.attendancePercent,
      study: acc.study + s.studyHoursPerWeek,
      marks: acc.marks + s.previousMarks,
      assignments: acc.assignments + s.assignmentsScore,
      participation: acc.participation + s.participationScore,
      extraCurricular: acc.extraCurricular + s.extraCurricularScore,
    }), { attendance: 0, study: 0, marks: 0, assignments: 0, participation: 0, extraCurricular: 0 });

    return {
      avgAttendance: sums.attendance / total,
      avgStudyHours: sums.study / total,
      avgPreviousMarks: sums.marks / total,
      avgAssignmentsScore: sums.assignments / total,
      avgParticipationScore: sums.participation / total,
      avgExtraCurricularScore: sums.extraCurricular / total,
    };
  }, [allStudents]);

  const selectedStudent = useMemo(() => {
    return allStudents.find(s => s.id === selectedStudentId) || null;
  }, [selectedStudentId, allStudents]);

  const handleGenerateReport = async () => {
    if (!selectedStudent) return;

    setLoading(true);
    setAiSummary('');

    try {
      const result = await generateStudentReport({
        studentName: selectedStudent.name,
        studentMetrics: {
          attendancePercent: selectedStudent.attendancePercent,
          studyHoursPerWeek: selectedStudent.studyHoursPerWeek,
          previousMarks: selectedStudent.previousMarks,
          assignmentsScore: selectedStudent.assignmentsScore,
          participationScore: selectedStudent.participationScore,
          extraCurricularScore: selectedStudent.extraCurricularScore,
          riskScore: selectedStudent.riskScore,
        },
        classAverages,
      });
      setAiSummary(result.reportSummary);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error Generating Summary',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCsv = () => {
    if (!selectedStudent) return;
    
    const reportData = {
        'Student Name': selectedStudent.name,
        'Student ID': selectedStudent.studentId,
        'Attendance (%)': selectedStudent.attendancePercent,
        'Class Avg Attendance (%)': classAverages.avgAttendance.toFixed(2),
        'Study Hours/Week': selectedStudent.studyHoursPerWeek,
        'Class Avg Study Hours/Week': classAverages.avgStudyHours.toFixed(2),
        'Previous Marks (%)': selectedStudent.previousMarks,
        'Class Avg Previous Marks (%)': classAverages.avgPreviousMarks.toFixed(2),
        'Assignments Score (%)': selectedStudent.assignmentsScore,
        'Class Avg Assignments Score (%)': classAverages.avgAssignmentsScore.toFixed(2),
        'Participation Score (%)': selectedStudent.participationScore,
        'Class Avg Participation Score (%)': classAverages.avgParticipationScore.toFixed(2),
        'Extra-Curricular Score (%)': selectedStudent.extraCurricularScore,
        'Class Avg Extra-Curricular Score (%)': classAverages.avgExtraCurricularScore.toFixed(2),
        'Latest Risk Score': selectedStudent.riskScore?.toFixed(3) ?? 'N/A',
        'AI Generated Summary': aiSummary,
    };

    const csv = Papa.unparse([reportData]);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedStudent.name}_performance_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const comparisonChartData = useMemo(() => {
    if (!selectedStudent) return [];

    return [
      { name: 'Attendance', Student: selectedStudent.attendancePercent, 'Class Average': classAverages.avgAttendance },
      { name: 'Prev. Marks', Student: selectedStudent.previousMarks, 'Class Average': classAverages.avgPreviousMarks },
      { name: 'Assignments', Student: selectedStudent.assignmentsScore, 'Class Average': classAverages.avgAssignmentsScore },
      { name: 'Participation', Student: selectedStudent.participationScore, 'Class Average': classAverages.avgParticipationScore },
      { name: 'Extra-Curricular', Student: selectedStudent.extraCurricularScore, 'Class Average': classAverages.avgExtraCurricularScore },
    ];
  }, [selectedStudent, classAverages]);

  const radarChartData = useMemo(() => {
    if (!selectedStudent) return [];
    
    return [
      { subject: 'Attendance', A: selectedStudent.attendancePercent, B: classAverages.avgAttendance.toFixed(1) },
      { subject: 'Study Hours', A: selectedStudent.studyHoursPerWeek, B: classAverages.avgStudyHours.toFixed(1) },
      { subject: 'Marks', A: selectedStudent.previousMarks, B: classAverages.avgPreviousMarks.toFixed(1) },
      { subject: 'Assignments', A: selectedStudent.assignmentsScore, B: classAverages.avgAssignmentsScore.toFixed(1) },
      { subject: 'Participation', A: selectedStudent.participationScore, B: classAverages.avgParticipationScore.toFixed(1) },
      { subject: 'Extra-Curricular', A: selectedStudent.extraCurricularScore, B: classAverages.avgExtraCurricularScore.toFixed(1) },
    ];
  }, [selectedStudent, classAverages]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Student</CardTitle>
          <CardDescription>Choose a student to generate a detailed performance report.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4 items-center">
            <Select onValueChange={setSelectedStudentId} value={selectedStudentId || ''}>
                <SelectTrigger className="w-full sm:w-[300px]">
                <SelectValue placeholder="Select a student..." />
                </SelectTrigger>
                <SelectContent>
                {allStudents.map(student => (
                    <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
                ))}
                </SelectContent>
            </Select>
            <Button onClick={handleGenerateReport} disabled={!selectedStudentId || loading} className="w-full sm:w-auto">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Report
            </Button>
        </CardContent>
      </Card>

      {selectedStudent && (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between">
                <div>
                    <CardTitle className="font-headline text-2xl">Performance Report for {selectedStudent.name}</CardTitle>
                    <CardDescription>Generated on {new Date().toLocaleDateString()}</CardDescription>
                </div>
                <Button onClick={handleDownloadCsv} variant="outline" disabled={!aiSummary}>
                    <Download className="mr-2 h-4 w-4" />
                    Download as Excel
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                {loading && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Generating AI summary...</span>
                    </div>
                )}
                {aiSummary && (
                    <Alert>
                        <BrainCircuit className="h-4 w-4" />
                        <AlertTitle>AI-Generated Summary</AlertTitle>
                        <AlertDescription>
                            {aiSummary}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Comparative Analysis</CardTitle>
                            <CardDescription>Spider chart comparing student to class average.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="subject" />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]}/>
                                    <Radar name={selectedStudent.name} dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                                    <Radar name="Class Average" dataKey="B" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.6} />
                                    <Legend />
                                    <Tooltip />
                                </RadarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Score Breakdown</CardTitle>
                            <CardDescription>Bar chart of student scores vs. class average.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={comparisonChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis domain={[0, 100]} unit="%" />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="Student" fill="hsl(var(--primary))" />
                                    <Bar dataKey="Class Average" fill="hsl(var(--chart-2))" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
