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
import { School, BarChart, Plus, Upload } from 'lucide-react'

export function AppSidebar() {
    const pathname = usePathname()

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
                <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">© {new Date().getFullYear()} Risk Insights</span>
                </div>
            </div>
        </SidebarFooter>
      </Sidebar>
  )
}
