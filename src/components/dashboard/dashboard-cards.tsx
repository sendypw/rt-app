
"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CalendarDays, FileText, CheckCircle, Loader2 } from "lucide-react";
import { mockApi } from "@/lib/data";
import type { User, Duty, Report } from "@/lib/types";
import { isPast, parseISO } from "date-fns";

export function DashboardCards() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeDuties: 0,
        totalReports: 0,
        attendancePercentage: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const [users, duties, reports] = await Promise.all([
                    mockApi.getUsers(),
                    mockApi.getSchedule(),
                    mockApi.getReports(),
                ]);

                const warga = users.filter(u => u.role === 'warga');
                const pastDuties = duties.filter(d => isPast(parseISO(d.date)));
                const attendedDuties = pastDuties.filter(d => d.attended).length;
                const attendancePercentage = pastDuties.length > 0 ? (attendedDuties / pastDuties.length) * 100 : 0;
                
                setStats({
                    totalUsers: warga.length,
                    activeDuties: duties.length,
                    totalReports: reports.length,
                    attendancePercentage: Math.round(attendancePercentage),
                });
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card><CardContent className="p-6 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></CardContent></Card>
                <Card><CardContent className="p-6 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></CardContent></Card>
                <Card><CardContent className="p-6 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></CardContent></Card>
                <Card><CardContent className="p-6 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></CardContent></Card>
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Warga
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                    <p className="text-xs text-muted-foreground">
                        Jumlah warga terdaftar
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Jadwal Aktif
                    </CardTitle>
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.activeDuties}</div>
                    <p className="text-xs text-muted-foreground">
                        Total tugas siskamling
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sudah Lapor</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalReports}</div>
                    <p className="text-xs text-muted-foreground">
                        Laporan tugas telah dikirim
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Kehadiran</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.attendancePercentage}%</div>
                    <p className="text-xs text-muted-foreground">
                        Dari jadwal yang telah lewat
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
