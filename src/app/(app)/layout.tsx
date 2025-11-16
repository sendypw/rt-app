"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import Header from '@/components/shared/header';
import MainNav from '@/components/shared/main-nav';
import { ShieldCheck } from 'lucide-react';
import { Loader2 } from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
        <div className="flex min-h-screen w-full flex-col bg-background">
            <Sidebar>
                <SidebarHeader className="p-4">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-8 w-8 text-primary" />
                        <h2 className="text-xl font-bold tracking-tight text-foreground font-headline group-data-[collapsible=icon]:hidden">
                            Jaga RT
                        </h2>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <MainNav />
                </SidebarContent>
            </Sidebar>
            <SidebarInset>
                <Header />
                <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8">
                    {children}
                </main>
            </SidebarInset>
        </div>
    </SidebarProvider>
  );
}
