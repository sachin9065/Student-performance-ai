
'use client';

import { useStudents } from '@/hooks/use-students';
import { ChatbotInterface } from '@/components/chatbot/chatbot-interface';
import { Loader2 } from 'lucide-react';


export default function ChatbotPage() {
    const { students, loading } = useStudents();

    return (
        <div className="flex flex-col h-[calc(100vh-5rem)]">
            <div className="p-4 sm:p-6 border-b">
                <h1 className="text-3xl font-bold tracking-tight font-headline">AI Assistant</h1>
                <p className="text-muted-foreground">Ask questions about student performance and get instant insights.</p>
            </div>
            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            ) : (
                <ChatbotInterface allStudents={students} />
            )}
        </div>
    )
}
