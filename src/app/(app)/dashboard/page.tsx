"use client";

import { DashboardCards } from '@/components/dashboard/dashboard-cards';
import { useAuth } from '@/lib/hooks/use-auth';

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">
                    Selamat datang kembali, {user?.name.split(' ')[0]}!
                </h1>
                <p className="text-muted-foreground">Inilah yang terjadi di komunitas Anda hari ini.</p>
            </div>
            <DashboardCards />
        </div>
    );
}
