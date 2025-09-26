
import { AuthGuard } from '@/lib/auth';

export default function StudentDashboardPage() {
  return (
    <AuthGuard>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold font-headline">Student Dashboard</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Welcome! This area is under construction.
        </p>
      </div>
    </AuthGuard>
  );
}
