'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Student } from '@/lib/types';
import { StudentCharts } from '@/components/dashboard/student-charts';
import { DataTable } from '@/components/data-table/data-table';
import { columns } from '@/components/data-table/columns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import Papa from 'papaparse';
import { useToast } from '@/hooks/use-toast';

function DashboardSkeleton() {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-[400px]" />
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

export default function DashboardPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsCollection = collection(db, 'students');
        const q = query(studentsCollection, orderBy('createdAt', 'desc'));
        const studentSnapshot = await getDocs(q);
        const studentList = studentSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Student));
        setStudents(studentList);
      } catch (err: any) {
        setError('Failed to fetch student data. Please check your Firestore connection and permissions.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleExport = () => {
    if (students.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Data to Export',
        description: 'There are no students in the roster to export.',
      });
      return;
    }

    // Sanitize data for CSV export, removing nested objects
    const dataToExport = students.map(({ id, predictionHistory, createdAt, ...rest }) => ({
        ...rest,
        riskScore: rest.riskScore?.toFixed(3) || 'N/A',
        createdAt: new Date(createdAt).toISOString(),
    }));


    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'students.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
        title: 'Export Successful',
        description: `${students.length} student records have been exported.`,
    });
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  const totalStudents = students.length;
  const highRiskStudents = students.filter(s => s.riskScore && s.riskScore > 0.75).length;
  const avgAttendance = totalStudents > 0 ? students.reduce((acc, s) => acc + s.attendancePercent, 0) / totalStudents : 0;
  const avgPerformance = totalStudents > 0 ? students.reduce((acc, s) => acc + s.previousMarks, 0) / totalStudents : 0;

  return (
    <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
                <p className="text-muted-foreground">Welcome to your student analytics dashboard.</p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export to CSV
                </Button>
                <Button asChild>
                    <Link href="/dashboard/add-student"><PlusCircle className="mr-2 h-4 w-4" />Add Student</Link>
                </Button>
            </div>
        </div>

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
                    <div className="text-2xl font-bold">{highRiskStudents}</div>
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
                <CardTitle>Student Analytics</CardTitle>
                <CardDescription>Visualize student data trends.</CardDescription>
            </CardHeader>
            <CardContent>
                <StudentCharts students={students} />
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Student Roster</CardTitle>
                <CardDescription>A list of all students in the system.</CardDescription>
            </CardHeader>
            <CardContent>
                <DataTable columns={columns} data={students} />
            </CardContent>
        </Card>
    </div>
  );
}
