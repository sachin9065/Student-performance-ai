'use client';

import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User } from "lucide-react";

export default function StudentDashboardPage() {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-headline">Student Dashboard</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Welcome, {user?.displayName || user?.email}!</CardTitle>
                    <CardDescription>This is your personal dashboard. From here, you can view your detailed profile and academic progress.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">To see your detailed analytics, risk score history, and AI insights, please visit your profile page.</p>
                    <Button asChild>
                        <Link href="/student-dashboard/my-profile">
                            <User className="mr-2 h-4 w-4" />
                            Go to My Profile
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
