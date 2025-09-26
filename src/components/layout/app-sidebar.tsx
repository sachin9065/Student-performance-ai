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
import { School, BarChart, Plus, Upload, User, LogOut } from 'lucide-react'
import { Button } from '../ui/button'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { Avatar, AvatarFallback } from '../ui/avatar'

export function AppSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const { user } = useAuth()

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/login');
      };

    const getInitials = (email: string | null | undefined) => {
        if (!email) return 'U';
        return email[0].toUpperCase();
    };

  return (
      <Sidebar>
        <SidebarHeader className="p-4">
            <Link href="/dashboard" className="flex items-center gap-2">
                <School className="w-8 h-8 text-primary" />
                <h2 className="text-xl font-bold font-headline">Risk Insights</h2>
            </Link>
        </SidebarHeader>

        <SidebarMenu className="flex-1 p-4">
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
        </SidebarMenu>
        
        <SidebarFooter className="p-4 border-t">
            <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                    <AvatarFallback>{getInitials(user?.email)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground truncate">{user?.email}</span>
                    <Button variant="link" size="sm" className="h-auto p-0 justify-start text-muted-foreground" onClick={handleLogout}>
                        <LogOut className="w-3 h-3 mr-1" />
                        Logout
                    </Button>
                </div>
            </div>
        </SidebarFooter>
      </Sidebar>
  )
}
