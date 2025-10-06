
'use client';

import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Student } from '@/lib/types';
import { useAuth } from '@/lib/auth';

export function useStudents() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
        setLoading(false);
        return;
    };

    const studentsCollection = collection(db, 'students');
    const q = query(studentsCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const studentList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Student));
      setStudents(studentList);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching students: ", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { students, loading };
}
