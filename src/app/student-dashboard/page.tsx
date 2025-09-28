'use client';

import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function StudentDashboardPage() {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-headline">Student Dashboard</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Welcome, {user?.displayName || user?.email}!</CardTitle>
                    <CardDescription>This is your personal dashboard. Your profile information is managed by your administrator.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>If you have any questions about your data, please contact your school's administration.</p>
                </CardContent>
            </Card>
        </div>
    )
}
