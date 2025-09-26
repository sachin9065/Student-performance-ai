import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Student } from '@/lib/types';
import { notFound } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, User, Calendar, Percent, BookOpen, Star, Target, BrainCircuit, Activity } from 'lucide-react';
import { getPredictiveInsightsForStudent } from '@/ai/flows/get-predictive-insights-for-student';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

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

async function PredictiveInsight({ student }: { student: Student }) {
    if (student.riskScore === undefined) {
      return (
        <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <p>Risk score not calculated. Cannot generate insights.</p>
        </div>
      );
    }
    
    let insight = "Could not load insight.";
    try {
        const result = await getPredictiveInsightsForStudent({ ...student, riskScore: student.riskScore });
        insight = result.insight;
    } catch (e) {
        console.error("Failed to get predictive insight", e);
    }
  
    return (
      <p>{insight}</p>
    );
}

export default async function StudentDetailPage({ params }: { params: { id: string } }) {
  const student = await getStudent(params.id);

  if (!student) {
    notFound();
  }

  return (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold font-headline">{student.name}</h1>
                <p className="text-muted-foreground">Student ID: {student.studentId}</p>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-muted-foreground font-medium">Risk Level:</span>
                <RiskBadge score={student.riskScore} />
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline"><BrainCircuit className="h-6 w-6 text-primary"/> AI Predictive Insight</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
                <Suspense fallback={<Skeleton className="h-6 w-3/4" />}>
                    <PredictiveInsight student={student} />
                </Suspense>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Student Overview</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <InfoCard icon={User} title="Age" value={student.age} />
                <InfoCard icon={User} title="Gender" value={student.gender} />
                <InfoCard icon={Target} title="Risk Score" value={(student.riskScore ?? 0).toFixed(3)} />
                <InfoCard icon={Calendar} title="Joined" value={new Date(student.createdAt).toLocaleDateString()} />
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
    </div>
  );
}
