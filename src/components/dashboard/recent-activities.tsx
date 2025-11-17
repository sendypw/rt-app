
"use client"

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { mockApi } from "@/lib/data";
import type { User, Report } from "@/lib/types";
import { formatDistanceToNow, parseISO } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Loader2 } from "lucide-react";

type EnrichedReport = Report & { user?: User };

export function RecentActivities() {
    const [recentReports, setRecentReports] = useState<EnrichedReport[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecentActivities = async () => {
            setLoading(true);
            try {
                const [reports, users] = await Promise.all([
                    mockApi.getReports(),
                    mockApi.getUsers(),
                ]);

                const enrichedReports = reports.map(report => ({
                    ...report,
                    user: users.find(u => u.id === report.userId)
                }));
                
                const sortedReports = enrichedReports
                    .sort((a, b) => parseISO(b.submittedAt).getTime() - parseISO(a.submittedAt).getTime())
                    .slice(0, 5);

                setRecentReports(sortedReports);
            } catch (error) {
                console.error("Failed to fetch recent activities:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentActivities();
    }, []);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Aktivitas Terkini</CardTitle>
        <CardDescription>
            Laporan tugas yang baru saja dikirim oleh warga.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto">
        {loading ? (
             <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : recentReports.length > 0 ? (
            <div className="space-y-8">
                {recentReports.map(report => (
                    <div className="flex items-center" key={report.id}>
                        <Avatar className="h-9 w-9">
                           <AvatarImage src={`https://avatar.vercel.sh/${report.userId}.png`} alt={report.user?.name || 'Avatar'} />
                           <AvatarFallback>{report.user ? getInitials(report.user.name) : '??'}</AvatarFallback>
                        </Avatar>
                        <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{report.user?.name || 'Warga Anonim'}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">{report.content}</p>
                        </div>
                        <div className="ml-auto text-xs text-muted-foreground">
                            {formatDistanceToNow(parseISO(report.submittedAt), { addSuffix: true, locale: idLocale })}
                        </div>
                    </div>
                ))}
            </div>
        ) : (
             <div className="flex justify-center items-center h-full">
                <p className="text-sm text-muted-foreground">Belum ada aktivitas.</p>
            </div>
        )}
      </CardContent>
    </Card>
  )
}
