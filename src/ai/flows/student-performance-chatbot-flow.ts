'use server';
/**
 * @fileOverview An AI chatbot flow for answering questions about student performance data.
 *
 * - askStudentPerformanceBot - A function that allows querying student data via a chatbot.
 * - AskStudentPerformanceBotInput - The input type for the chatbot.
 * - AskStudentPerformanceBotOutput - The return type for the chatbot.
 */

import {ai} from '@/ai/genkit';
import {Student} from '@/lib/types';
import {z} from 'genkit';

const StudentSchemaForBot = z.object({
    id: z.string(),
    studentId: z.string(),
    name: z.string(),
    age: z.number(),
    gender: z.enum(['Male', 'Female', 'Other']),
    attendancePercent: z.number(),
    studyHoursPerWeek: z.number(),
    previousMarks: z.number(),
    assignmentsScore: z.number(),
    participationScore: z.number(),
    extraCurricularScore: z.number(),
    riskScore: z.optional(z.number()),
});


const AskStudentPerformanceBotInputSchema = z.object({
  question: z.string().describe('The question from the user about student data.'),
  studentData: z.array(StudentSchemaForBot).describe('An array of all student records available for analysis.'),
});

export type AskStudentPerformanceBotInput = z.infer<
  typeof AskStudentPerformanceBotInputSchema
>;

const AskStudentPerformanceBotOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the user\'s question.'),
});

export type AskStudentPerformanceBotOutput = z.infer<
  typeof AskStudentPerformanceBotOutputSchema
>;

export async function askStudentPerformanceBot(
  input: AskStudentPerformanceBotInput
): Promise<AskStudentPerformanceBotOutput> {
  return studentPerformanceChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'studentPerformanceChatbotPrompt',
  input: {schema: AskStudentPerformanceBotInputSchema},
  output: {schema: AskStudentPerformanceBotOutputSchema},
  prompt: `You are an AI assistant for educators, specialized in analyzing student performance data.
  
  You have access to a list of students with the following data points:
  - id, studentId, name, age, gender, attendancePercent, studyHoursPerWeek, previousMarks, assignmentsScore, participationScore, extraCurricularScore, riskScore.

  Your task is to answer the user's question based on the provided student data. Provide clear, concise, and data-driven answers. If the question is ambiguous, ask for clarification. If the question is outside the scope of student performance, politely decline to answer.

  Here is the student data:
  {{jsonStringify studentData}}

  User's question: "{{{question}}}"

  Your answer:
  `,
});

const studentPerformanceChatbotFlow = ai.defineFlow(
  {
    name: 'studentPerformanceChatbotFlow',
    inputSchema: AskStudentPerformanceBotInputSchema,
    outputSchema: AskStudentPerformanceBotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
