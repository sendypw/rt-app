
"use client";

import { useAuth } from '@/lib/hooks/use-auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardCards } from '@/components/dashboard/dashboard-cards';
import { Overview } from '@/components/dashboard/overview';
import { RecentActivities } from '@/components/dashboard/recent-activities';

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dasbor</h2>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">
                Ikhtisar
              </TabsTrigger>
              <TabsTrigger value="analytics" disabled>
                Analitik
              </TabsTrigger>
              <TabsTrigger value="reports" disabled>
                Laporan
              </TabsTrigger>
              <TabsTrigger value="notifications" disabled>
                Notifikasi
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <DashboardCards />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4">
                    <Overview />
                </div>
                <div className="col-span-4 lg:col-span-3">
                    <RecentActivities />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
    );
}
