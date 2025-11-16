"use client"

import { UserNav } from '@/components/shared/user-nav';
import { SidebarTrigger } from '../ui/sidebar';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Bell } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Link href="/notifications">
          <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifikasi</span>
          </Button>
        </Link>
        <UserNav />
      </div>
    </header>
  );
}
