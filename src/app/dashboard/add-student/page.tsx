'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { runInference } from '@/lib/model';
import { addStudentAction } from '@/actions/student-actions';

const formSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  name: z.string().min(1, 'Name is required'),
  age: z.coerce.number().int().positive('Age must be a positive number'),
  gender: z.enum(['Male', 'Female', 'Other']),
  attendancePercent: z.coerce.number().min(0).max(100, 'Must be between 0 and 100'),
  studyHoursPerWeek: z.coerce.number().min(0, 'Must be a positive number'),
  previousMarks: z.coerce.number().min(0).max(100, 'Must be between 0 and 100'),
  assignmentsScore: z.coerce.number().min(0).max(100, 'Must be between 0 and 100'),
  participationScore: z.coerce.number().min(0).max(100, 'Must be between 0 and 100'),
  extraCurricularScore: z.coerce.number().min(0).max(100, 'Must be between 0 and 100'),
});

type StudentFormValues = z.infer<typeof formSchema>;

export default function AddStudentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: '',
      name: '',
      age: undefined,
      gender: 'Male',
      attendancePercent: undefined,
      studyHoursPerWeek: undefined,
      previousMarks: undefined,
      assignmentsScore: undefined,
      participationScore: undefined,
      extraCurricularScore: undefined,
    },
  });

  const onSubmit = async (data: StudentFormValues) => {
    setLoading(true);
    try {
      const studentDataForInference = { ...data, id: '', createdAt: 0 };
      const riskScore = await runInference(studentDataForInference);

      const studentDataToSave = {
        ...data,
        riskScore,
        createdAt: Date.now(),
      };
      
      const result = await addStudentAction(studentDataToSave);
      
      if (result.success) {
        toast({
          title: 'Student Added',
          description: `${data.name} has been added to the roster.`,
        });
        router.push('/dashboard');
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to add student.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Add a New Student</CardTitle>
        <CardDescription>Fill out the form below to add a single student to the database.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="studentId" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Student ID</FormLabel>
                    <FormControl><Input placeholder="S12345" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="age" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl><Input type="number" placeholder="18" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="gender" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl>
                        <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )} />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                <FormField control={form.control} name="attendancePercent" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Attendance (%)</FormLabel>
                    <FormControl><Input type="number" placeholder="95" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="studyHoursPerWeek" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Study Hours/Week</FormLabel>
                    <FormControl><Input type="number" placeholder="10" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="previousMarks" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Previous Marks (%)</FormLabel>
                    <FormControl><Input type="number" placeholder="88" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )} />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                <FormField control={form.control} name="assignmentsScore" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Assignments Score (%)</FormLabel>
                    <FormControl><Input type="number" placeholder="92" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="participationScore" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Participation Score (%)</FormLabel>
                    <FormControl><Input type="number" placeholder="85" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="extraCurricularScore" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Extra-Curricular Score (%)</FormLabel>
                    <FormControl><Input type="number" placeholder="75" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )} />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Student
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
