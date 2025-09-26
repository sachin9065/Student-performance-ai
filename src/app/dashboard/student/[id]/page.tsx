'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Student } from '@/lib/types';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, User, Calendar, Percent, BookOpen, Star, Target, BrainCircuit, Activity, RefreshCw, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { updateStudentPredictionAction } from '@/actions/student-actions';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Loader2 } from 'lucide-react';

async function getStudent(id: string): Promise<Student | null> {
    const docRef = doc(db, 'students', id);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Student;
    } else {
      return null;
    }
}
  
const RiskBadge = ({ score }: { score: number | undefined }) => {
    if (score === undefined) return <Badge variant="outline" className="text-lg">N/A</Badge>;
    if (score > 0.75) return <Badge variant="destructive" className="text-lg">High Risk</Badge>;
    if (score > 0.4) return <Badge className="bg-yellow-500 text-white text-lg">Medium Risk</Badge>;
    return <Badge className="bg-green-500 text-white text-lg">Low Risk</Badge>;
};

function InfoCard({ icon: Icon, title, value, unit }: { icon: React.ElementType, title: string, value: string | number, unit?: string }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}{unit}</div>
            </CardContent>
        </Card>
    );
}

export default function StudentDetailPage({ params }: { params: { id: string } }) {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      const studentData = await getStudent(params.id);
      if (studentData) {
        setStudent(studentData);
      } else {
        notFound();
      }
      setLoading(false);
    };
    fetchStudent();
  }, [params.id]);

  const handleUpdatePrediction = async () => {
    setUpdating(true);
    try {
        const result = await updateStudentPredictionAction(params.id);
        if (result.success && result.prediction) {
            setStudent(prev => prev ? { ...prev, riskScore: result.prediction!.riskScore, predictionHistory: [...prev.predictionHistory, result.prediction!] } : null);
            toast({
                title: "Prediction Updated",
                description: `New risk score is ${result.prediction.riskScore.toFixed(3)}.`
            })
        } else {
            throw new Error(result.error || 'Failed to update prediction.');
        }
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Update Failed',
            description: error.message
        });
    }
    setUpdating(false);
  }

  if (loading || !student) {
    return (
        <div className="space-y-6">
            <Card><CardHeader><CardTitle>Loading student data...</CardTitle></CardHeader></Card>
        </div>
    );
  }
  
  const formattedHistory = student.predictionHistory.map(p => ({
    date: format(new Date(p.createdAt), 'MMM d, yyyy'),
    riskScore: p.riskScore
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());


  return (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold font-headline">{student.name}</h1>
                <p className="text-muted-foreground">Student ID: {student.studentId}</p>
            </div>
            <div className="flex items-center gap-4">
                <Button onClick={handleUpdatePrediction} disabled={updating}>
                    {updating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                    Generate New Prediction
                </Button>
                <div className="flex items-center gap-2">
                    <span className="text-muted-foreground font-medium">Latest Risk:</span>
                    <RiskBadge score={student.riskScore} />
                </div>
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline"><BrainCircuit className="h-6 w-6 text-primary"/> Latest AI Predictive Insight</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
                {student.predictionHistory.length > 0 ? (
                    <p>{student.predictionHistory[student.predictionHistory.length - 1].insight}</p>
                ) : (
                    <p>No predictions available.</p>
                )}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Risk Score Progress</CardTitle>
                <CardDescription>Chart of risk score over time.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                {formattedHistory.length > 1 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={formattedHistory}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={[0, 1]} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="riskScore" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        <p>Not enough data to display a progress chart. At least two predictions are needed.</p>
                    </div>
                )}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Academic & Engagement Metrics</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <InfoCard icon={Percent} title="Attendance" value={student.attendancePercent} unit="%" />
                <InfoCard icon={BookOpen} title="Study Hours / Week" value={student.studyHoursPerWeek} />
                <InfoCard icon={Star} title="Previous Marks" value={student.previousMarks} unit="%" />
                <InfoCard icon={Star} title="Assignments Score" value={student.assignmentsScore} unit="%" />
                <InfoCard icon={Star} title="Participation Score" value={student.participationScore} unit="%" />
                <InfoCard icon={Activity} title="Extra-Curriculars" value={student.extraCurricularScore} unit="%" />
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline"><History className="h-6 w-6 text-primary"/> Prediction History</CardTitle>
            </CardHeader>
            <CardContent>
                {student.predictionHistory.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                     {[...student.predictionHistory].reverse().map((p, index) => (
                        <AccordionItem value={`item-${index}`} key={p.createdAt}>
                            <AccordionTrigger>
                                <div className="flex justify-between w-full pr-4">
                                    <span>{format(new Date(p.createdAt), 'MMMM d, yyyy h:mm a')}</span>
                                    <RiskBadge score={p.riskScore} />
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                <p className="font-semibold mb-2">AI Insight:</p>
                                {p.insight}
                            </AccordionContent>
                        </AccordionItem>
                     ))}
                </Accordion>
                ) : (
                    <p className="text-muted-foreground">No prediction history available.</p>
                )}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Student Overview</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <InfoCard icon={User} title="Age" value={student.age} />
                <InfoCard icon={User} title="Gender" value={student.gender} />
                <InfoCard icon={Target} title="Latest Risk Score" value={(student.riskScore ?? 0).toFixed(3)} />
                <InfoCard icon={Calendar} title="Joined" value={new Date(student.createdAt).toLocaleDateString()} />
            </CardContent>
        </Card>
    </div>
  );
}
