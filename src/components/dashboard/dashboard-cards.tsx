"use client"

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/use-auth';
import { mockApi } from '@/lib/data';
import type { Duty, Report } from '@/lib/types';
import { format, isToday, isFuture, parseISO } from 'date-fns';
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
        console.error("Failed to fetch dashboard data", error);
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
            title: "Attendance Recorded",
            description: "Thank you for checking in for your duty.",
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
        title: "Report Submitted",
        description: "Your duty report has been successfully submitted.",
    });
    // Find the button with data-dialog-close and click it
    const closeButton = document.querySelector('[data-dialog-close]') as HTMLElement;
    closeButton?.click();
  };

  if (loading) {
    return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card><CardHeader><CardTitle>Loading...</CardTitle></CardHeader><CardContent><Loader2 className="h-8 w-8 animate-spin text-primary" /></CardContent></Card>
    </div>;
  }
  
  if (!nextDuty) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><CalendarCheck/> My Next Duty</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You have no upcoming duties scheduled.</p>
        </CardContent>
      </Card>
    );
  }

  const dutyDate = parseISO(nextDuty.date);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><CalendarCheck/> My Next Duty</CardTitle>
          <CardDescription>Your upcoming community watch schedule.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-4xl font-bold text-primary font-headline">{format(dutyDate, 'dd')}</p>
          <p className="text-lg text-muted-foreground">{format(dutyDate, 'MMMM yyyy')}</p>
          <p className="font-semibold">{format(dutyDate, 'EEEE')}</p>
        </CardContent>
        <CardFooter>
            {isToday(dutyDate) && !nextDuty.attended && (
                <Button onClick={handleCheckIn} disabled={isCheckingIn}>
                    {isCheckingIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Check-in Now
                </Button>
            )}
            {isToday(dutyDate) && nextDuty.attended && (
                <div className="flex items-center text-green-600 gap-2">
                    <CheckCircle />
                    <span>Checked-in</span>
                </div>
            )}
            {isFuture(dutyDate) && <p className="text-sm text-muted-foreground">Check-in will be available on the duty date.</p>}
        </CardFooter>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText/> Duty Report</CardTitle>
          <CardDescription>Submit your report after completing your duty.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
            {submittedReport ? (
                <div>
                    <p className="font-semibold text-green-600">Report Submitted!</p>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{submittedReport.content}</p>
                </div>
            ) : (
                <p className="text-muted-foreground">You can submit your report after your duty is completed.</p>
            )}
        </CardContent>
        <CardFooter>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" disabled={!nextDuty.attended || !!submittedReport}>
                        {submittedReport ? 'View Report' : 'Submit Report'}
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Duty Report for {format(dutyDate, 'PPPP')}</DialogTitle>
                    <DialogDescription>
                        Please provide a brief summary of your duty shift. Note any incidents or observations.
                    </DialogDescription>
                    </DialogHeader>
                    <Textarea
                        placeholder="e.g., Everything was calm and secure. No unusual activity observed."
                        rows={6}
                        value={submittedReport ? submittedReport.content : reportContent}
                        onChange={(e) => setReportContent(e.target.value)}
                        readOnly={!!submittedReport}
                    />
                    <DialogFooter>
                    <DialogClose asChild data-dialog-close>
                        <Button variant="ghost">Cancel</Button>
                    </DialogClose>
                    {!submittedReport && (
                        <Button onClick={handleReportSubmit} disabled={isSubmittingReport}>
                            {isSubmittingReport && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit
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
