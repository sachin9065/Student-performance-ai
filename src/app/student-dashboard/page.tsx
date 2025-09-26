'use client';

import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function StudentDashboardPage() {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-headline">Student Dashboard</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Welcome, {user?.displayName || user?.email}!</CardTitle>
                    <CardDescription>This is your personal dashboard. View your profile and prediction details.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">You can view your detailed academic and risk profile by clicking the button below.</p>
                    <Button asChild>
                        <Link href="/student-dashboard/my-profile">View My Profile</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
