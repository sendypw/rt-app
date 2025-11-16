"use client"

import { useState, useEffect } from 'react';
import { mockApi } from '@/lib/data';
import type { SwapRequest, User, Duty, Notification } from '@/lib/types';
import { useAuth } from '@/lib/hooks/use-auth';
import { format, parseISO } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Check, X, CalendarClock, ArrowRightLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import Link from 'next/link';

type EnrichedSwapRequest = SwapRequest & {
    fromUser: User;
    toUser: User;
    fromDuty: Duty;
    toDuty: Duty;
};

export function NotificationList() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const allNotifications = await mockApi.getNotifications(user.id);
            setNotifications(allNotifications);
        } catch (error) {
            console.error("Gagal mengambil notifikasi:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Gagal memuat notifikasi.' });
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchNotifications();
    }, [user]);

    const handleResponse = async (requestId: string, status: 'approved' | 'rejected') => {
        const originalNotifications = [...notifications];
        
        // Optimistically update UI
        setNotifications(prev => prev.map(n => {
            if (n.type === 'swap_request' && n.swapRequest.id === requestId) {
                return {
                    ...n,
                    swapRequest: { ...n.swapRequest, status: status }
                };
            }
            return n;
        }));

        try {
            await mockApi.updateSwapRequestStatus(requestId, status);
            toast({
                title: 'Sukses',
                description: `Permintaan tukar telah di${status === 'approved' ? 'setujui' : 'tolak'}.`
            });
            fetchNotifications(); // Re-fetch to confirm
        } catch (error) {
            // Revert UI on error
            setNotifications(originalNotifications);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Gagal memperbarui status permintaan.'
            });
        }
    }


    if (loading) {
        return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    if (notifications.length === 0) {
        return (
            <Card>
                <CardContent className="p-6">
                    <p className="text-center text-muted-foreground">Tidak ada notifikasi saat ini.</p>
                </CardContent>
            </Card>
        )
    }

    const renderSwapRequest = (req: EnrichedSwapRequest) => (
        <Card key={req.id}>
            <CardHeader>
                <CardTitle className='text-lg flex justify-between items-center'>
                    <span className='flex items-center gap-2'><ArrowRightLeft/> Permintaan Tukar Jadwal</span>
                    <Badge variant={
                        req.status === 'approved' ? 'default' :
                        req.status === 'rejected' ? 'destructive' :
                        'secondary'
                    } className={req.status === 'approved' ? 'bg-green-500' : ''}>
                        {req.status === 'pending' && 'Menunggu'}
                        {req.status === 'approved' && 'Disetujui'}
                        {req.status === 'rejected' && 'Ditolak'}
                    </Badge>
                </CardTitle>
                <CardDescription>
                    {req.fromUserId === user?.id ? 
                     `Anda meminta untuk bertukar jadwal dengan ${req.toUser.name}.` :
                     `${req.fromUser.name} ingin bertukar jadwal dengan Anda.`
                    }
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <div>
                        <p className="font-semibold">{req.fromUserId === user?.id ? `${req.fromUser.name} (Anda)` : req.fromUser.name}</p>
                        <p className="text-sm text-muted-foreground">{format(parseISO(req.fromDuty.date), 'PPPP', {locale: idLocale})}</p>
                   </div>
                   <div>
                        <p className="font-semibold">{req.toUserId === user?.id ? `${req.toUser.name} (Anda)` : req.toUser.name}</p>
                        <p className="text-sm text-muted-foreground">{format(parseISO(req.toDuty.date), 'PPPP', {locale: idLocale})}</p>
                   </div>
                </div>
                <div>
                    <p className="text-sm font-medium">Alasan:</p>
                    <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md">{req.reason}</p>
                </div>
            </CardContent>
            {req.toUserId === user?.id && req.status === 'pending' && (
                <CardFooter className='gap-2'>
                    <Button className='w-full' onClick={() => handleResponse(req.id, 'approved')}><Check className='mr-2 h-4 w-4'/> Setuju</Button>
                    <Button className='w-full' variant='destructive' onClick={() => handleResponse(req.id, 'rejected')}><X className='mr-2 h-4 w-4'/> Tolak</Button>
                </CardFooter>
            )}
        </Card>
    );

    const renderDutyReminder = (duty: Duty, user: User) => (
         <Card key={`reminder-${duty.id}`}>
            <CardHeader>
                <CardTitle className='text-lg flex items-center gap-2'><CalendarClock/> Pengingat Tugas</CardTitle>
                <CardDescription>
                    Anda memiliki jadwal siskamling yang akan datang.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="flex items-center space-x-4 rounded-md border p-4">
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Tugas Siskamling</p>
                        <p className="text-sm text-muted-foreground">
                           Besok, {format(parseISO(duty.date), 'PPPP', {locale: idLocale})}
                        </p>
                    </div>
                </div>
            </CardContent>
             <CardFooter>
                <Button asChild className='w-full' variant="outline">
                    <Link href="/schedule">Lihat Jadwal</Link>
                </Button>
            </CardFooter>
        </Card>
    );

    return (
        <div className="space-y-4">
            {notifications.map(n => {
                if (n.type === 'swap_request') {
                    const req = n.swapRequest as EnrichedSwapRequest;
                    return renderSwapRequest(req);
                }
                if (n.type === 'duty_reminder' && n.user && n.duty) {
                    return renderDutyReminder(n.duty, n.user);
                }
                return null;
            })}
        </div>
    )
}
