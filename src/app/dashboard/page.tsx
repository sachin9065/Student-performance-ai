

import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Student } from '@/lib/types';
import { StudentCharts } from '@/components/dashboard/student-charts';
import { DataTable } from '@/components/data-table/data-table';
import { columns } from '@/components/data-table/columns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Siren } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { ExportButton } from '@/components/dashboard/export-button';

async function getStudents(): Promise<Student[]> {
    try {
        const studentsCollection = collection(db, 'students');
        const q = query(studentsCollection, orderBy('createdAt', 'desc'));
        const studentSnapshot = await getDocs(q);
        const studentList = studentSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Student));
        return studentList;
    } catch (err: any) {
        console.error('Failed to fetch student data:', err);
        // In a real app, you might want to throw the error
        // and let an error boundary handle it.
        return []; 
    }
}

export default async function DashboardPage() {
  const students = await getStudents();
  
  const totalStudents = students.length;
  const highRiskStudents = students.filter(s => s.riskScore && s.riskScore > 0.75);
  const avgAttendance = totalStudents > 0 ? students.reduce((acc, s) => acc + s.attendancePercent, 0) / totalStudents : 0;
  const avgPerformance = totalStudents > 0 ? students.reduce((acc, s) => acc + s.previousMarks, 0) / totalStudents : 0;

  const topStudentIds = [...students]
    .sort((a, b) => b.previousMarks - a.previousMarks)
    .slice(0, 3)
    .map(s => s.id);

  const studentsWithBadges = students.map(student => ({
    ...student,
    isTopStudent: topStudentIds.includes(student.id),
  }));

  return (
    <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
                <p className="text-muted-foreground">Welcome to your student analytics dashboard.</p>
            </div>
            <div className="flex gap-2">
                <ExportButton students={students} />
                <Button asChild>
                    <Link href="/dashboard/add-student"><PlusCircle className="mr-2 h-4 w-4" />Add Student</Link>
                </Button>
            </div>
        </div>

        {highRiskStudents.length > 0 && (
            <Alert variant="destructive">
                <Siren className="h-4 w-4" />
                <AlertTitle>High-Risk Student Alert</AlertTitle>
                <AlertDescription>
                    The following students have a high risk score and may require immediate attention:
                    <ul className="mt-2 list-disc list-inside">
                        {highRiskStudents.map(student => (
                            <li key={student.id}>
                                <Button variant="link" className="p-0 h-auto" asChild>
                                    <Link href={`/dashboard/student/${student.id}`}>{student.name}</Link>
                                </Button>
                                 (Risk Score: {student.riskScore?.toFixed(2)})
                            </li>
                        ))}
                    </ul>
                </AlertDescription>
            </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalStudents}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">High-Risk Students</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{highRiskStudents.length}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{avgAttendance.toFixed(1)}%</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Performance</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{avgPerformance.toFixed(1)}%</div>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Student Data</CardTitle>
                <CardDescription>Browse, search, and manage all student records.</CardDescription>
            </CardHeader>
            <CardContent>
                <DataTable columns={columns} data={studentsWithBadges} />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Analytics Overview</CardTitle>
                <CardDescription>Visualize trends in student performance and engagement.</CardDescription>
            </CardHeader>
            <CardContent>
                <StudentCharts students={students} />
            </CardContent>
        </Card>
    </div>
  );
}
