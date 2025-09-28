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
  name: z.string().describe('The name of the student.'),
  age: z.number().describe('The age of the student.'),
  gender: z.string().describe('The gender of the student.'),
  attendancePercent: z.number().describe('The attendance percentage of the student.'),
  studyHoursPerWeek: z.number().describe('The number of study hours per week of the student.'),
  previousMarks: z.number().describe('The previous marks of the student.'),
  assignmentsScore: z.number().describe('The assignments score of the student.'),
  participationScore: z.number().describe('The participation score of the student.'),
  extraCurricularScore: z.number().describe('The extra-curricular score of the student.'),
  riskScore: z.number().describe('The risk score (0-1) calculated for the student.'),
  riskFactors: z.string().describe('The key factors contributing to the risk score.'),
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
  prompt: `You are an AI assistant that provides predictive insights for a student based on their data and a pre-calculated risk analysis.
  
  Student Name: {{{name}}}
  
  Student Data:
  - Age: {{{age}}}
  - Gender: {{{gender}}}
  - Attendance: {{{attendancePercent}}}%
  - Study Hours/Week: {{{studyHoursPerWeek}}}
  - Previous Marks: {{{previousMarks}}}%
  - Assignments Score: {{{assignmentsScore}}}%
  - Participation Score: {{{participationScore}}}%
  - Extra-Curricular Score: {{{extraCurricularScore}}}%
  
  AI Risk Analysis:
  - Calculated Risk Score: {{{riskScore}}}
  - Key Risk Factors: {{{riskFactors}}}

  Based on all of the above, provide a concise, actionable insight (maximum 50 words) for an educator. The insight should explain why the student might be at risk and suggest a potential area for intervention.
  `,
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
