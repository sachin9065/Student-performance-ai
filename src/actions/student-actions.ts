'use server';

import { collection, writeBatch, doc, setDoc, updateDoc, arrayUnion, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Student, Prediction } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { getPredictiveInsightsForStudent } from '@/ai/flows/get-predictive-insights-for-student';
import { calculateStudentRiskScore } from '@/ai/flows/calculate-student-risk-score';

export async function addStudentAction(studentData: Omit<Student, 'id' | 'createdAt' | 'predictionHistory'>) {
  try {
    const newDocRef = doc(collection(db, 'students'));
    const studentId = newDocRef.id;

    // Run initial inference and get insight
    const { riskScore, riskFactors } = await calculateStudentRiskScore({ ...studentData, studentId, tfjsModelScore: 0 }); // tfjsModelScore is no longer used, but schema expects it for now
    const insightResult = await getPredictiveInsightsForStudent({ ...studentData, riskScore, riskFactors });

    const initialPrediction: Prediction = {
      riskScore,
      insight: insightResult.insight,
      createdAt: Date.now(),
    };
    
    const studentToSave: Omit<Student, 'id'> = {
      ...studentData,
      riskScore,
      predictionHistory: [initialPrediction],
      createdAt: Date.now(),
    };

    await setDoc(newDocRef, studentToSave);

    revalidatePath('/dashboard');
    revalidatePath(`/dashboard/student/${newDocRef.id}`);
    
    return { success: true, id: newDocRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateStudentAction(studentId: string, studentData: Omit<Student, 'id' | 'createdAt' | 'predictionHistory' | 'riskScore'>) {
    try {
      const studentRef = doc(db, 'students', studentId);
      await updateDoc(studentRef, studentData);
  
      revalidatePath('/dashboard');
      revalidatePath(`/dashboard/student/${studentId}`);
      revalidatePath(`/dashboard/student/${studentId}/edit`);
      
      return { success: true, id: studentId };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

export async function bulkAddStudentsAction(students: Omit<Student, 'id' | 'createdAt' | 'predictionHistory'>[]) {
  if (students.length === 0 || students.length > 500) {
    return { success: false, error: 'Invalid number of students. Must be between 1 and 500.' };
  }
  
  const batch = writeBatch(db);

  try {
    for (const student of students) {
      const docRef = doc(collection(db, 'students'));
      const { riskScore, riskFactors } = await calculateStudentRiskScore({ ...student, studentId: docRef.id, tfjsModelScore: 0 });
      const insightResult = await getPredictiveInsightsForStudent({ ...student, riskScore, riskFactors });
      
      const initialPrediction: Prediction = {
        riskScore,
        insight: insightResult.insight,
        createdAt: Date.now(),
      };
      
      const studentToSave: Omit<Student, 'id'> = {
        ...student,
        riskScore,
        predictionHistory: [initialPrediction],
        createdAt: Date.now(),
      };

      batch.set(docRef, studentToSave);
    }

    await batch.commit();
    revalidatePath('/dashboard');
    return { success: true, count: students.length };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateStudentPredictionAction(studentId: string) {
  try {
    const studentRef = doc(db, 'students', studentId);
    const studentSnap = await getDoc(studentRef);

    if (!studentSnap.exists()) {
      return { success: false, error: 'Student not found.' };
    }

    const studentData = studentSnap.data() as Omit<Student, 'id'>;

    const { riskScore, riskFactors } = await calculateStudentRiskScore({ ...studentData, studentId, tfjsModelScore: studentData.riskScore || 0 });
    const insightResult = await getPredictiveInsightsForStudent({ ...studentData, riskScore, riskFactors });

    const newPrediction: Prediction = {
      riskScore,
      insight: insightResult.insight,
      createdAt: Date.now(),
    };

    await updateDoc(studentRef, {
      riskScore: riskScore,
      predictionHistory: arrayUnion(newPrediction)
    });

    revalidatePath('/dashboard');
    revalidatePath(`/dashboard/student/${studentId}`);
    
    return { success: true, prediction: newPrediction };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteStudentAction(studentId: string) {
  try {
    const studentRef = doc(db, 'students', studentId);
    await deleteDoc(studentRef);

    revalidatePath('/dashboard');
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
