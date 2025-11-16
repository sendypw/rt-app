"use client"

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/use-auth';
import { mockApi } from '@/lib/data';
import type { Duty, Report } from '@/lib/types';
import { format, isToday, isFuture, parseISO } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarCheck, FileText, CheckCircle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Textarea } from '../ui/textarea';
import { useToast } from '@/hooks/use-toast';

export function DashboardCards() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [nextDuty, setNextDuty] = useState<Duty | null>(null);
  const [submittedReport, setSubmittedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportContent, setReportContent] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      setLoading(true);
      try {
        const allDuties = await mockApi.getSchedule();
        const userDuties = allDuties
          .filter(d => d.userId === user.id)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        const upcomingDuty = userDuties.find(d => isToday(parseISO(d.date)) || isFuture(parseISO(d.date))) || null;
        setNextDuty(upcomingDuty);

        if (upcomingDuty) {
            const allReports = await mockApi.getReports();
            const report = allReports.find(r => r.dutyId === upcomingDuty.id) || null;
            setSubmittedReport(report);
        }

      } catch (error) {
        console.error("Gagal mengambil data dasbor", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  const handleCheckIn = async () => {
    if (!nextDuty) return;
    setIsCheckingIn(true);
    const updatedDuty = await mockApi.updateDuty(nextDuty.id, { attended: true });
    if(updatedDuty) {
        setNextDuty(updatedDuty);
        toast({
            title: "Kehadiran Dicatat",
            description: "Terima kasih telah melakukan check-in untuk tugas Anda.",
        });
    }
    setIsCheckingIn(false);
  }

  const handleReportSubmit = async () => {
    if (!nextDuty || !reportContent) return;
    setIsSubmittingReport(true);
    const newReport = await mockApi.submitReport({
      dutyId: nextDuty.id,
      userId: user!.id,
      content: reportContent,
    });
    setSubmittedReport(newReport);
    setIsSubmittingReport(false);
    setReportContent("");
    toast({
        title: "Laporan Terkirim",
        description: "Laporan tugas Anda telah berhasil dikirim.",
    });
    // Find the button with data-dialog-close and click it
    const closeButton = document.querySelector('[data-dialog-close]') as HTMLElement;
    closeButton?.click();
  };

  if (loading) {
    return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card><CardHeader><CardTitle>Memuat...</CardTitle></CardHeader><CardContent><Loader2 className="h-8 w-8 animate-spin text-primary" /></CardContent></Card>
    </div>;
  }
  
  if (!nextDuty) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><CalendarCheck/> Tugas Berikutnya</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Anda tidak memiliki jadwal tugas yang akan datang.</p>
        </CardContent>
      </Card>
    );
  }

  const dutyDate = parseISO(nextDuty.date);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><CalendarCheck/> Tugas Berikutnya</CardTitle>
          <CardDescription>Jadwal siskamling Anda yang akan datang.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-4xl font-bold text-primary font-headline">{format(dutyDate, 'dd')}</p>
          <p className="text-lg text-muted-foreground">{format(dutyDate, 'MMMM yyyy', { locale: idLocale })}</p>
          <p className="font-semibold">{format(dutyDate, 'EEEE', { locale: idLocale })}</p>
        </CardContent>
        <CardFooter>
            {isToday(dutyDate) && !nextDuty.attended && (
                <Button onClick={handleCheckIn} disabled={isCheckingIn}>
                    {isCheckingIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Check-in Sekarang
                </Button>
            )}
            {isToday(dutyDate) && nextDuty.attended && (
                <div className="flex items-center text-green-600 gap-2">
                    <CheckCircle />
                    <span>Sudah Check-in</span>
                </div>
            )}
            {isFuture(dutyDate) && <p className="text-sm text-muted-foreground">Check-in akan tersedia pada tanggal tugas.</p>}
        </CardFooter>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText/> Laporan Tugas</CardTitle>
          <CardDescription>Kirim laporan Anda setelah menyelesaikan tugas.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
            {submittedReport ? (
                <div>
                    <p className="font-semibold text-green-600">Laporan Terkirim!</p>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{submittedReport.content}</p>
                </div>
            ) : (
                <p className="text-muted-foreground">Anda dapat mengirimkan laporan setelah tugas Anda selesai.</p>
            )}
        </CardContent>
        <CardFooter>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" disabled={!nextDuty.attended || !!submittedReport}>
                        {submittedReport ? 'Lihat Laporan' : 'Kirim Laporan'}
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Laporan Tugas untuk {format(dutyDate, 'PPPP', { locale: idLocale })}</DialogTitle>
                    <DialogDescription>
                        Harap berikan ringkasan singkat tentang giliran tugas Anda. Catat setiap insiden atau pengamatan.
                    </DialogDescription>
                    </DialogHeader>
                    <Textarea
                        placeholder="cth., Semuanya tenang dan aman. Tidak ada aktivitas yang tidak biasa yang diamati."
                        rows={6}
                        value={submittedReport ? submittedReport.content : reportContent}
                        onChange={(e) => setReportContent(e.target.value)}
                        readOnly={!!submittedReport}
                    />
                    <DialogFooter>
                    <DialogClose asChild data-dialog-close>
                        <Button variant="ghost">Batal</Button>
                    </DialogClose>
                    {!submittedReport && (
                        <Button onClick={handleReportSubmit} disabled={isSubmittingReport}>
                            {isSubmittingReport && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Kirim
                        </Button>
                    )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
}
