export interface Student {
  id: string; // Firestore document ID
  studentId: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  attendancePercent: number;
  studyHoursPerWeek: number;
  previousMarks: number;
  assignmentsScore: number;
  participationScore: number;
  extraCurricularScore: number;
  riskScore?: number;
  label?: string; // Optional field
  createdAt: number; // Unix timestamp
}
