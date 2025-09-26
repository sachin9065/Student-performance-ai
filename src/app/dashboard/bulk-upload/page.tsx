'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Papa from 'papaparse';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { runInference } from '@/lib/model';
import { bulkAddStudentsAction } from '@/actions/student-actions';
import { Loader2, UploadCloud, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ACCEPTED_FILE_TYPES = ['text/csv'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const formSchema = z.object({
  csvFile: z
    .instanceof(FileList)
    .refine((files) => files?.length === 1, 'CSV file is required.')
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine((files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type), 'Only .csv files are accepted.'),
});

type CsvFormValues = z.infer<typeof formSchema>;
type StudentCsvRow = Record<string, any>;

export default function BulkUploadPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [previewData, setPreviewData] = useState<StudentCsvRow[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  const form = useForm<CsvFormValues>({ resolver: zodResolver(formSchema) });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setPreviewData([]);
      setErrors([]);
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        preview: 5,
        complete: (results) => {
          if (results.errors.length > 0) {
            setErrors(['Failed to parse CSV. Please check the file format.']);
          } else {
            setPreviewData(results.data as StudentCsvRow[]);
          }
        },
      });
    }
  };

  const handleUpload = async () => {
    const file = form.getValues('csvFile')?.[0];
    if (!file) return;

    setLoading(true);
    setErrors([]);

    try {
      const results = await new Promise<Papa.ParseResult<StudentCsvRow>>((resolve) => {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          complete: resolve,
        });
      });

      if (results.errors.length > 0) {
        throw new Error('CSV parsing failed. Check file for errors.');
      }
      
      const studentsToProcess = results.data.map((row, index) => {
        const student = {
            studentId: String(row.studentId || ''),
            name: String(row.name || ''),
            age: Number(row.age),
            gender: row.gender,
            attendancePercent: Number(row.attendancePercent),
            studyHoursPerWeek: Number(row.studyHoursPerWeek),
            previousMarks: Number(row.previousMarks),
            assignmentsScore: Number(row.assignmentsScore),
            participationScore: Number(row.participationScore),
            extraCurricularScore: Number(row.extraCurricularScore),
        };
        // Basic validation
        if (!student.studentId || !student.name || isNaN(student.age)) {
            throw new Error(`Invalid data in row ${index + 2}. studentId, name, and age are required.`);
        }
        return student;
      });

      const studentsWithScores = await Promise.all(
        studentsToProcess.map(async (student) => {
          const riskScore = await runInference({ ...student, id: '', createdAt: 0 });
          return { ...student, riskScore, createdAt: Date.now() };
        })
      );
      
      const result = await bulkAddStudentsAction(studentsWithScores);

      if (result.success) {
        toast({
          title: 'Upload Successful',
          description: `${result.count} students have been added to the database.`,
        });
        router.push('/dashboard');
      } else {
        throw new Error(result.error);
      }

    } catch (error: any) {
      setErrors([error.message]);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Bulk Upload Students</CardTitle>
          <CardDescription>Upload a CSV file to add multiple students at once. Ensure your CSV has the required headers.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4">
              <FormField
                control={form.control}
                name="csvFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CSV File</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".csv"
                        onChange={(e) => {
                          field.onChange(e.target.files);
                          handleFileChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
      </Card>

      {previewData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>CSV Preview</CardTitle>
            <CardDescription>This is a preview of the first few rows of your file. Confirm the data looks correct before uploading.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(previewData[0]).map((key) => (
                      <TableHead key={key}>{key}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.map((row, index) => (
                    <TableRow key={index}>
                      {Object.values(row).map((value, i) => (
                        <TableCell key={i}>{String(value)}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {errors.length > 0 && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Errors Found</AlertTitle>
                <AlertDescription>
                  <ul>{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
                </AlertDescription>
              </Alert>
            )}
            <div className="mt-6 flex justify-end">
              <Button onClick={handleUpload} disabled={loading || errors.length > 0}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm and Upload
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
