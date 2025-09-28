// src/app/dashboard/reports/page.tsx

import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Student } from '@/lib/types';
import { ReportGenerator } from '@/components/reports/report-generator';

async function getStudents(): Promise<Student[]> {
    try {
        const studentsCollection = collection(db, 'students');
        const q = query(studentsCollection);
        const studentSnapshot = await getDocs(q);
        const studentList = studentSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Student));
        return studentList;
    } catch (err: any) {
        console.error('Failed to fetch student data:', err);
        return []; 
    }
}

export default async function ReportsPage() {
    const students = await getStudents();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">Reports & Insights</h1>
                <p className="text-muted-foreground">Generate detailed performance reports for individual students.</p>
            </div>
            <ReportGenerator allStudents={students} />
        </div>
    )
}
