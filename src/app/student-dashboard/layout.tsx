import React from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { AuthGuard } from '@/lib/auth';

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="flex flex-col">
              <AppHeader />
              <main className="flex-1 overflow-auto p-4 md:p-6">
                  {children}
              </main>
          </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
