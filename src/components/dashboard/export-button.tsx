
'use client';

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Student } from "@/lib/types";
import { Download } from "lucide-react";
import Papa from "papaparse";

export function ExportButton({ students }: { students: Student[] }) {
    const { toast } = useToast();

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

    return (
        <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export to CSV
        </Button>
    )
}
