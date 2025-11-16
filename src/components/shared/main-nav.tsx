"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { cn } from '@/lib/utils';
import { LayoutDashboard, CalendarDays, Shield, Bell, Calendar } from 'lucide-react';
import {
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar"

const navItems = [
  { href: '/dashboard', label: 'Dasbor', icon: LayoutDashboard },
  { href: '/schedule', label: 'Jadwal', icon: CalendarDays },
  { href: '/calendar', label: 'Kalender', icon: Calendar },
  { href: '/notifications', label: 'Notifikasi', icon: Bell },
  { href: '/admin', label: 'Admin', icon: Shield, adminOnly: true },
];

export default function MainNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <nav className="flex flex-col gap-2 px-2">
        <SidebarMenu>
            {navItems.map((item) => {
                if (item.adminOnly && user?.role !== 'admin') {
                return null;
                }
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

                return (
                    <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                            <Link href={item.href}>
                                <item.icon className="h-5 w-5" />
                                <span>{item.label}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                );
            })}
      </SidebarMenu>
    </nav>
  );
}
