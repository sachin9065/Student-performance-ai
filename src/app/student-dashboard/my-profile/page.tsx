'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth';
import type { Student } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, Percent, BookOpen, Star, Target, BrainCircuit, Activity, History, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


async function getStudentByEmail(email: string): Promise<Student | null> {
    const studentsRef = collection(db, "students");
    // This query assumes the student's email is used as their studentId upon creation.
    const q = query(studentsRef, where("studentId", "==", email), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
        return null;
    }
    
    const studentDoc = querySnapshot.docs[0];
    return { id: studentDoc.id, ...studentDoc.data() } as Student;
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

export default function StudentProfilePage() {
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStudent() {
      if (!user || !user.email) {
        setError("You must be logged in to view your profile.");
        setLoading(false);
        return;
      }

      try {
        const studentData = await getStudentByEmail(user.email);
        if (studentData) {
          setStudent(studentData);
        } else {
          setError("Your student profile could not be found. Please contact your administrator if you believe this is an error.");
        }
      } catch (err: any) {
        setError("An error occurred while fetching your profile: " + err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStudent();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
        <Alert variant="destructive">
            <BrainCircuit className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    );
  }

  if (!student) {
    return notFound();
  }
  
  const formattedHistory = (student.predictionHistory || []).map(p => ({
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
            <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-medium">Latest Risk:</span>
                <RiskBadge score={student.riskScore} />
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline"><BrainCircuit className="h-6 w-6 text-primary"/> Latest AI Predictive Insight</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
                {student.predictionHistory && student.predictionHistory.length > 0 ? (
                    <p>{student.predictionHistory[student.predictionHistory.length - 1].insight}</p>
                ) : (
                    <p>No predictions available.</p>
                )}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Risk Score Progress</CardTitle>
                <CardDescription>Chart of your risk score over time.</CardDescription>
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
                <CardTitle className="font-headline">Your Academic & Engagement Metrics</CardTitle>
            </Header>
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
            </Header>
            <CardContent>
                {student.predictionHistory && student.predictionHistory.length > 0 ? (
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
                <CardTitle className="font-headline">Your Overview</CardTitle>
            </Header>
            <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <InfoCard icon={User} title="Age" value={student.age} />
                <InfoCard icon={User} title="Gender" value={student.gender} />
                <InfoCard icon={Target} title="Latest Risk Score" value={(student.riskScore ?? 0).toFixed(3)} />
                <InfoCard icon={Calendar} title="Record Created" value={new Date(student.createdAt).toLocaleDateString()} />
            </CardContent>
        </Card>
    </div>
  );
}
