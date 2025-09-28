// src/app/dashboard/chatbot/page.tsx

import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Student } from '@/lib/types';
import { ChatbotInterface } from '@/components/chatbot/chatbot-interface';

async function getStudents(): Promise<Student[]> {
    try {
        const studentsCollection = collection(db, 'students');
        const q = query(studentsCollection);
        const studentSnapshot = await getDocs(q);
        const studentList = studentSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Student));
        return studentList;
    } catch (err: any) {
        console.error('Failed to fetch student data:', err);
        return []; 
    }
}

export default async function ChatbotPage() {
    const students = await getStudents();

    return (
        <div className="flex flex-col h-[calc(100vh-5rem)]">
            <div className="p-4 sm:p-6 border-b">
                <h1 className="text-3xl font-bold tracking-tight font-headline">AI Assistant</h1>
                <p className="text-muted-foreground">Ask questions about student performance and get instant insights.</p>
            </div>
            <ChatbotInterface allStudents={students} />
        </div>
    )
}
