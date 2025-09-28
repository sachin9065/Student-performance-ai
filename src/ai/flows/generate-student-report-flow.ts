'use server';
/**
 * @fileOverview Generates a comprehensive performance report for a student.
 *
 * - generateStudentReport - A function that creates a detailed report by comparing a student's metrics against class averages.
 * - GenerateStudentReportInput - The input type for the generateStudentReport function.
 * - GenerateStudentReportOutput - The return type for the generateStudentReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStudentReportInputSchema = z.object({
  studentName: z.string().describe("The name of the student."),
  studentMetrics: z.object({
    attendancePercent: z.number().describe("The student's attendance percentage."),
    studyHoursPerWeek: z.number().describe("The student's weekly study hours."),
    previousMarks: z.number().describe("The student's previous marks percentage."),
    assignmentsScore: z.number().describe("The student's assignments score percentage."),
    participationScore: z.number().describe("The student's participation score percentage."),
    extraCurricularScore: z.number().describe("The student's extra-curricular score percentage."),
    riskScore: z.number().optional().describe("The student's calculated risk score (0 to 1)."),
  }),
  classAverages: z.object({
    avgAttendance: z.number().describe("The class average attendance percentage."),
    avgStudyHours: z.number().describe("The class average weekly study hours."),
    avgPreviousMarks: z.number().describe("The class average for previous marks."),
    avgAssignmentsScore: z.number().describe("The class average for assignments score."),
    avgParticipationScore: z.number().describe("The class average for participation score."),
    avgExtraCurricularScore: z.number().describe("The class average for extra-curricular score."),
  }),
});

export type GenerateStudentReportInput = z.infer<typeof GenerateStudentReportInputSchema>;

const GenerateStudentReportOutputSchema = z.object({
  reportSummary: z.string().describe("A narrative summary of the student's performance, comparing them to class averages and identifying strengths and areas for improvement."),
});

export type GenerateStudentReportOutput = z.infer<typeof GenerateStudentReportOutputSchema>;

export async function generateStudentReport(input: GenerateStudentReportInput): Promise<GenerateStudentReportOutput> {
  return generateStudentReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudentReportPrompt',
  input: {schema: GenerateStudentReportInputSchema},
  output: {schema: GenerateStudentReportOutputSchema},
  prompt: `You are an expert educational analyst. Your task is to generate a performance report for a student named {{{studentName}}}.

Analyze the student's metrics in comparison to the class averages and provide a concise, insightful summary (3-4 sentences).

**Student's Data:**
- Attendance: {{{studentMetrics.attendancePercent}}}%
- Study Hours/Week: {{{studentMetrics.studyHoursPerWeek}}}
- Previous Marks: {{{studentMetrics.previousMarks}}}%
- Assignments Score: {{{studentMetrics.assignmentsScore}}}%
- Participation Score: {{{studentMetrics.participationScore}}}%
- Extra-Curricular Score: {{{studentMetrics.extraCurricularScore}}}%
{{#if studentMetrics.riskScore}}- Risk Score: {{studentMetrics.riskScore}}{{/if}}

**Class Averages:**
- Attendance: {{{classAverages.avgAttendance}}}%
- Study Hours/Week: {{{classAverages.avgStudyHours}}}
- Previous Marks: {{{classAverages.avgPreviousMarks}}}%
- Assignments Score: {{{classAverages.avgAssignmentsScore}}}%
- Participation Score: {{{classAverages.avgParticipationScore}}}%
- Extra-Curricular Score: {{{classAverages.avgExtraCurricularScore}}}%

Based on this data, generate a summary that highlights where the student excels compared to their peers and which areas may require attention. Be objective and constructive in your analysis.
`,
});

const generateStudentReportFlow = ai.defineFlow(
  {
    name: 'generateStudentReportFlow',
    inputSchema: GenerateStudentReportInputSchema,
    outputSchema: GenerateStudentReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
