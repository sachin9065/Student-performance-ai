'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar'
import { School, BarChart, Plus, Upload, User, LayoutDashboard } from 'lucide-react'
import { useAuth } from '@/lib/auth'

export function AppSidebar() {
    const pathname = usePathname()
    const { user, userRole } = useAuth();

  return (
      <Sidebar>
        <SidebarHeader className="p-4">
            <Link href="/" className="flex items-center gap-2">
                <School className="w-8 h-8 text-primary" />
                <h2 className="text-xl font-bold font-headline">Predictive Analytics</h2>
            </Link>
        </SidebarHeader>

        <SidebarMenu className="flex-1 p-4">
            {userRole === 'Admin' && (
                <>
                    <SidebarMenuItem>
                    <Link href="/dashboard" passHref>
                        <SidebarMenuButton
                        isActive={pathname === '/dashboard'}
                        tooltip="Dashboard"
                        >
                        <BarChart />
                        <span>Dashboard</span>
                        </SidebarMenuButton>
                    </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                    <Link href="/dashboard/add-student" passHref>
                        <SidebarMenuButton
                        isActive={pathname === '/dashboard/add-student'}
                        tooltip="Add Student"
                        >
                        <Plus />
                        <span>Add Student</span>
                        </SidebarMenuButton>
                    </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                    <Link href="/dashboard/bulk-upload" passHref>
                        <SidebarMenuButton
                        isActive={pathname === '/dashboard/bulk-upload'}
                        tooltip="Bulk Upload"
                        >
                        <Upload />
                        <span>Bulk Upload</span>
                        </SidebarMenuButton>
                    </Link>
                    </SidebarMenuItem>
                </>
            )}
            {userRole === 'Student' && (
                <>
                 <SidebarMenuItem>
                    <Link href="/student-dashboard" passHref>
                        <SidebarMenuButton
                        isActive={pathname === '/student-dashboard'}
                        tooltip="Dashboard"
                        >
                        <LayoutDashboard />
                        <span>Dashboard</span>
                        </SidebarMenuButton>
                    </Link>
                 </SidebarMenuItem>
                 <SidebarMenuItem>
                    <Link href="/student-dashboard/my-profile" passHref>
                        <SidebarMenuButton
                        isActive={pathname === '/student-dashboard/my-profile'}
                        tooltip="My Profile"
                        >
                        <User />
                        <span>My Profile</span>
                        </SidebarMenuButton>
                    </Link>
                 </SidebarMenuItem>
                </>
            )}
        </SidebarMenu>
        
        <SidebarFooter className="p-4 border-t">
            <div className="flex items-center gap-3">
                <div className="flex flex-col">
                    <span className="font-medium text-sm">{user?.displayName || user?.email}</span>
                    <span className="text-sm text-muted-foreground">{userRole}</span>
                </div>
            </div>
        </SidebarFooter>
      </Sidebar>
  )
}
