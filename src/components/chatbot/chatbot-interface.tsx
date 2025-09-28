'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import type { Student } from '@/lib/types';
import { askStudentPerformanceBot } from '@/ai/flows/student-performance-chatbot-flow';
import { Loader2, User, Bot, Send } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { cn } from '@/lib/utils';
import { Card } from '../ui/card';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatbotInterface({ allStudents }: { allStudents: Student[] }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const result = await askStudentPerformanceBot({
        question: input,
        studentData: allStudents,
      });

      setMessages([...newMessages, { role: 'assistant', content: result.answer }]);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'The AI assistant could not be reached. Please try again.',
      });
       setMessages(newMessages); // Rollback to previous state on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-4 sm:p-6">
            <div className="space-y-6">
            {messages.length === 0 && (
              <Card className="p-6 text-center text-muted-foreground">
                <Bot className="mx-auto h-10 w-10 mb-4" />
                <p className="font-semibold">Welcome to the AI Assistant!</p>
                <p className="text-sm">You can ask questions like:</p>
                <ul className="text-sm list-disc list-inside mt-2">
                    <li>"Who are the top 3 students by previous marks?"</li>
                    <li>"Which students have attendance below 80%?"</li>
                    <li>"What is the average assignment score?"</li>
                </ul>
              </Card>
            )}
            {messages.map((message, index) => (
                <div key={index} className={cn("flex items-start gap-3", message.role === 'user' ? 'justify-end' : '')}>
                     {message.role === 'assistant' && (
                        <Avatar className="w-8 h-8 border">
                            <AvatarFallback><Bot size={16} /></AvatarFallback>
                        </Avatar>
                     )}
                     <div className={cn("max-w-prose p-3 rounded-lg", message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                     </div>
                     {message.role === 'user' && (
                        <Avatar className="w-8 h-8 border">
                            <AvatarFallback><User size={16} /></AvatarFallback>
                        </Avatar>
                     )}
                </div>
            ))}
            {loading && (
                <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8 border">
                        <AvatarFallback><Bot size={16} /></AvatarFallback>
                    </Avatar>
                    <div className="bg-muted p-3 rounded-lg">
                        <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                </div>
            )}
            </div>
        </ScrollArea>
        <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about student data..."
                disabled={loading}
            />
            <Button type="submit" disabled={loading || !input.trim()} size="icon">
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
            </Button>
            </form>
        </div>
    </div>
  );
}
