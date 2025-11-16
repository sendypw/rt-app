"use client"

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/hooks/use-auth';
import { mockApi } from '@/lib/data';
import type { Duty, Report } from '@/lib/types';
import { format, isToday, isFuture, parseISO } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarCheck, FileText, CheckCircle, Loader2, Camera, Upload, SwitchCamera } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from '../ui/input';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export function DashboardCards() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [nextDuty, setNextDuty] = useState<Duty | null>(null);
  const [submittedReport, setSubmittedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportContent, setReportContent] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCameraTabActive, setIsCameraTabActive] = useState(false);

  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [activeCameraIndex, setActiveCameraIndex] = useState(0);

  const fetchData = async () => {
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

  useEffect(() => {
    fetchData();
  }, [user]);

  const stopCamera = () => {
      if (videoRef.current?.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
          videoRef.current.srcObject = null;
      }
  }

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);
  
  const getCameraPermission = async (deviceId?: string) => {
    stopCamera();
    try {
        const videoConstraints: MediaTrackConstraints = deviceId ? { deviceId: { exact: deviceId } } : { facingMode: 'user' };
        const stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = allDevices.filter(device => device.kind === 'videoinput');
        setCameras(videoDevices);

    } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Akses Kamera Ditolak',
          description: 'Mohon izinkan akses kamera di pengaturan browser Anda untuk menggunakan fitur ini.',
        });
    }
  };

  const handleSwitchCamera = () => {
    const nextCameraIndex = (activeCameraIndex + 1) % cameras.length;
    setActiveCameraIndex(nextCameraIndex);
    getCameraPermission(cameras[nextCameraIndex].deviceId);
  }

  useEffect(() => {
      if (isCameraTabActive) {
          getCameraPermission();
      } else {
          stopCamera();
      }
  }, [isCameraTabActive]);


  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        if (context) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
            const dataUrl = canvasRef.current.toDataURL('image/jpeg');
            setPhoto(dataUrl);
            setIsCameraTabActive(false); // Turn off camera by changing tab state
        }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setPhoto(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

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
      photo: photo || undefined
    });
    setSubmittedReport(newReport);
    setIsSubmittingReport(false);
    setReportContent("");
    setPhoto(null);
    toast({
        title: "Laporan Terkirim",
        description: "Laporan tugas Anda telah berhasil dikirim.",
    });
    const closeButton = document.querySelector('[data-dialog-close]') as HTMLElement;
    closeButton?.click();
  };

  const handleOpenReportDialog = () => {
      setReportContent(submittedReport ? submittedReport.content : "");
      setPhoto(submittedReport ? submittedReport.photo || null : null);
  }

  const handleCloseReportDialog = (open: boolean) => {
      if (!open) {
          setIsCameraTabActive(false);
          stopCamera();
          setReportContent("");
          setPhoto(null);
      }
  }


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
                    {submittedReport.photo && <p className="text-sm text-muted-foreground mt-2">Lampiran foto disertakan.</p>}
                </div>
            ) : (
                <p className="text-muted-foreground">Anda dapat mengirimkan laporan setelah tugas Anda selesai.</p>
            )}
        </CardContent>
        <CardFooter>
            <Dialog onOpenChange={handleCloseReportDialog}>
                <DialogTrigger asChild>
                    <Button variant="outline" disabled={!nextDuty.attended} onClick={handleOpenReportDialog}>
                        {submittedReport ? 'Lihat Laporan' : 'Kirim Laporan'}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
                    <DialogHeader>
                    <DialogTitle>Laporan Tugas untuk {format(dutyDate, 'PPPP', { locale: idLocale })}</DialogTitle>
                    <DialogDescription>
                        Harap berikan ringkasan singkat tentang giliran tugas Anda. Catat setiap insiden atau pengamatan dan sertakan foto jika perlu.
                    </DialogDescription>
                    </DialogHeader>
                    <div className='flex-grow overflow-y-auto -mx-6 px-6 space-y-4'>
                        <Textarea
                            placeholder="cth., Semuanya tenang dan aman. Tidak ada aktivitas yang tidak biasa yang diamati."
                            rows={5}
                            value={reportContent}
                            onChange={(e) => setReportContent(e.target.value)}
                            readOnly={!!submittedReport}
                        />
                        {!submittedReport && (
                        <Tabs defaultValue="upload" onValueChange={(value) => setIsCameraTabActive(value === 'camera')}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="upload"><Upload className="mr-2"/> Unggah File</TabsTrigger>
                                <TabsTrigger value="camera"><Camera className="mr-2"/> Ambil Foto</TabsTrigger>
                            </TabsList>
                            <TabsContent value="upload">
                                <Input id="picture" type="file" accept="image/*" onChange={handleFileUpload} />
                            </TabsContent>
                            <TabsContent value="camera" className="flex flex-col gap-2">
                                <div className="relative">
                                    <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline/>
                                    {hasCameraPermission && cameras.length > 1 && (
                                        <Button onClick={handleSwitchCamera} size="icon" variant="secondary" className="absolute top-2 right-2 rounded-full">
                                            <SwitchCamera />
                                            <span className="sr-only">Ganti Kamera</span>
                                        </Button>
                                    )}
                                </div>
                                <canvas ref={canvasRef} className="hidden"></canvas>
                                {isCameraTabActive && hasCameraPermission === false && (
                                    <Alert variant="destructive">
                                        <AlertTitle>Akses Kamera Diperlukan</AlertTitle>
                                        <AlertDescription>
                                            Mohon izinkan akses kamera untuk menggunakan fitur ini.
                                        </AlertDescription>
                                    </Alert>
                                )}
                                <Button onClick={handleCapture} disabled={!hasCameraPermission}>Ambil Gambar</Button>
                            </TabsContent>
                        </Tabs>
                        )}
                        {photo && (
                            <div className="mt-4">
                                <p className="font-medium text-sm mb-2">Pratinjau Foto:</p>
                                <Image src={photo} alt="Pratinjau Laporan" width={400} height={300} className="rounded-md object-cover w-full h-auto" />
                                {!submittedReport && <Button variant="link" size="sm" className="text-destructive px-0" onClick={() => setPhoto(null)}>Hapus Foto</Button>}
                            </div>
                        )}
                    </div>
                    <DialogFooter className="mt-auto pt-4 border-t shrink-0">
                        <DialogClose asChild data-dialog-close>
                            <Button variant="ghost">Tutup</Button>
                        </DialogClose>
                        {!submittedReport && (
                            <Button onClick={handleReportSubmit} disabled={isSubmittingReport || !reportContent}>
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

    