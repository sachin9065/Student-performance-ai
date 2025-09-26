'use server';

import { collection, writeBatch, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Student } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function addStudentAction(studentData: Omit<Student, 'id'>) {
  try {
    const newDocRef = doc(collection(db, 'students'));
    await setDoc(newDocRef, studentData);
    revalidatePath('/dashboard');
    return { success: true, id: newDocRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function bulkAddStudentsAction(students: Omit<Student, 'id'>[]) {
  if (students.length === 0 || students.length > 500) {
    return { success: false, error: 'Invalid number of students. Must be between 1 and 500.' };
  }
  
  const batch = writeBatch(db);

  try {
    students.forEach((student) => {
      const docRef = doc(collection(db, 'students'));
      batch.set(docRef, student);
    });

    await batch.commit();
    revalidatePath('/dashboard');
    return { success: true, count: students.length };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
