// src/ai/flows/get-predictive-insights-for-student.ts
'use server';

/**
 * @fileOverview Provides predictive insights for a specific student based on their data.
 *
 * - getPredictiveInsightsForStudent - A function that retrieves predictive insights for a student.
 * - GetPredictiveInsightsForStudentInput - The input type for the getPredictiveInsightsForStudent function.
 * - GetPredictiveInsightsForStudentOutput - The return type for the getPredictiveInsightsForStudent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetPredictiveInsightsForStudentInputSchema = z.object({
  studentId: z.string().describe('The ID of the student to get insights for.'),
  name: z.string().describe('The name of the student.'),
  age: z.number().describe('The age of the student.'),
  gender: z.string().describe('The gender of the student.'),
  attendancePercent: z.number().describe('The attendance percentage of the student.'),
  studyHoursPerWeek: z.number().describe('The number of study hours per week of the student.'),
  previousMarks: z.number().describe('The previous marks of the student.'),
  assignmentsScore: z.number().describe('The assignments score of the student.'),
  participationScore: z.number().describe('The participation score of the student.'),
  extraCurricularScore: z.number().describe('The extra-curricular score of the student.'),
  riskScore: z.number().describe('The risk score (0-1) calculated by the TFJS model.'),
});
export type GetPredictiveInsightsForStudentInput = z.infer<
  typeof GetPredictiveInsightsForStudentInputSchema
>;

const GetPredictiveInsightsForStudentOutputSchema = z.object({
  insight: z.string().describe('The predictive insight for the student.'),
});
export type GetPredictiveInsightsForStudentOutput = z.infer<
  typeof GetPredictiveInsightsForStudentOutputSchema
>;

export async function getPredictiveInsightsForStudent(
  input: GetPredictiveInsightsForStudentInput
): Promise<GetPredictiveInsightsForStudentOutput> {
  return getPredictiveInsightsForStudentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getPredictiveInsightsForStudentPrompt',
  input: {schema: GetPredictiveInsightsForStudentInputSchema},
  output: {schema: GetPredictiveInsightsForStudentOutputSchema},
  prompt: `You are an AI assistant that provides predictive insights for a student based on their data.

  Here is the student's data:
  - Student ID: {{{studentId}}}
  - Name: {{{name}}}
  - Age: {{{age}}}
  - Gender: {{{gender}}}
  - Attendance Percentage: {{{attendancePercent}}}
  - Study Hours Per Week: {{{studyHoursPerWeek}}}
  - Previous Marks: {{{previousMarks}}}
  - Assignments Score: {{{assignmentsScore}}}
  - Participation Score: {{{participationScore}}}
  - Extra-Curricular Score: {{{extraCurricularScore}}}
  - Risk Score: {{{riskScore}}}

  Provide a concise insight (maximum 50 words) explaining why the student is flagged as high-risk, considering all the data provided, and including which factors contribute most to the risk score.
  Insight: `,
});

const getPredictiveInsightsForStudentFlow = ai.defineFlow(
  {
    name: 'getPredictiveInsightsForStudentFlow',
    inputSchema: GetPredictiveInsightsForStudentInputSchema,
    outputSchema: GetPredictiveInsightsForStudentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
