
export interface Prediction {
  riskScore: number;
  insight: string;
  createdAt: number;
}

export interface Student {
  id: string; // Firestore document ID
  studentId: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  photoURL?: string;
  attendancePercent: number;
  studyHoursPerWeek: number;
  previousMarks: number;
  assignmentsScore: number;
  participationScore: number;
  extraCurricularScore: number;
  riskScore?: number; // Latest risk score
  predictionHistory: Prediction[];
  createdAt: number; // Unix timestamp
  isTopStudent?: boolean;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'Admin' | 'Student';
}
