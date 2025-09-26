// src/ai/flows/calculate-student-risk-score.ts
'use server';
/**
 * @fileOverview Calculates a risk score for a student based on their data, providing insights into potential needs for additional support.
 *
 * - calculateStudentRiskScore - A function that calculates the risk score for a student.
 * - CalculateStudentRiskScoreInput - The input type for the calculateStudentRiskScore function.
 * - CalculateStudentRiskScoreOutput - The return type for the calculateStudentRiskScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateStudentRiskScoreInputSchema = z.object({
  studentId: z.string().describe('The unique identifier for the student.'),
  name: z.string().describe('The name of the student.'),
  age: z.number().int().positive().describe('The age of the student.'),
  gender: z.string().describe('The gender of the student.'),
  attendancePercent: z.number().min(0).max(100).describe('The attendance percentage of the student.'),
  studyHoursPerWeek: z.number().min(0).describe('The number of study hours per week the student dedicates.'),
  previousMarks: z.number().min(0).max(100).describe('The previous marks of the student.'),
  assignmentsScore: z.number().min(0).max(100).describe('The assignment score of the student.'),
  participationScore: z.number().min(0).max(100).describe('The participation score of the student.'),
  extraCurricularScore: z.number().min(0).max(100).describe('The extra-curricular score of the student.'),
  tfjsModelScore: z.number().min(0).max(1).describe('The risk score as determined by the TFJS model (between 0 and 1).'),
});
export type CalculateStudentRiskScoreInput = z.infer<typeof CalculateStudentRiskScoreInputSchema>;

const CalculateStudentRiskScoreOutputSchema = z.object({
  riskScore: z.number().min(0).max(1).describe('The calculated risk score for the student (between 0 and 1).'),
  riskFactors: z.string().describe('A summary of the key factors contributing to the student\u2019s risk score.'),
});
export type CalculateStudentRiskScoreOutput = z.infer<typeof CalculateStudentRiskScoreOutputSchema>;

export async function calculateStudentRiskScore(input: CalculateStudentRiskScoreInput): Promise<CalculateStudentRiskScoreOutput> {
  return calculateStudentRiskScoreFlow(input);
}

const calculateStudentRiskScorePrompt = ai.definePrompt({
  name: 'calculateStudentRiskScorePrompt',
  input: {schema: CalculateStudentRiskScoreInputSchema},
  output: {schema: CalculateStudentRiskScoreOutputSchema},
  prompt: `You are an AI assistant that evaluates student data and calculates a risk score, providing insights into potential needs for additional support.

  Evaluate the following student data:
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
  - TFJS Model Risk Score: {{{tfjsModelScore}}}

  Based on this information, calculate a risk score between 0 and 1 (inclusive), where 0 indicates very low risk and 1 indicates very high risk. Provide also a short list of the most important risk factors.
`,
});

const calculateStudentRiskScoreFlow = ai.defineFlow(
  {
    name: 'calculateStudentRiskScoreFlow',
    inputSchema: CalculateStudentRiskScoreInputSchema,
    outputSchema: CalculateStudentRiskScoreOutputSchema,
  },
  async input => {
    const {output} = await calculateStudentRiskScorePrompt(input);
    return output!;
  }
);
