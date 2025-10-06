
'use client';

import { useStudents } from '@/hooks/use-students';
import { ReportGenerator } from '@/components/reports/report-generator';
import { Loader2 } from 'lucide-react';

export default function ReportsPage() {
    const { students, loading } = useStudents();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">Reports & Insights</h1>
                <p className="text-muted-foreground">Generate detailed performance reports for individual students.</p>
            </div>
            {loading ? (
                 <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                 </div>
            ) : (
                <ReportGenerator allStudents={students} />
            )}
        </div>
    )
}
