"use client"

import { useState, useEffect } from 'react';
import { mockApi } from '@/lib/data';
import type { SwapRequest, User, Duty } from '@/lib/types';
import { useAuth } from '@/lib/hooks/use-auth';
import { format, parseISO } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';

type EnrichedSwapRequest = SwapRequest & {
    fromUser: User;
    toUser: User;
    fromDuty: Duty;
    toDuty: Duty;
};

export function NotificationList() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [requests, setRequests] = useState<EnrichedSwapRequest[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const [swapRequests, users, duties] = await Promise.all([
                mockApi.getSwapRequests(),
                mockApi.getUsers(),
                mockApi.getSchedule(),
            ]);

            const userRequests = swapRequests.filter(req => req.toUserId === user.id || req.fromUserId === user.id);

            const enriched = userRequests.map(req => {
                return {
                    ...req,
                    fromUser: users.find(u => u.id === req.fromUserId)!,
                    toUser: users.find(u => u.id === req.toUserId)!,
                    fromDuty: duties.find(d => d.id === req.fromDutyId)!,
                    toDuty: duties.find(d => d.id === req.toDutyId)!,
                }
            }).sort((a,b) => b.id.localeCompare(a.id));

            setRequests(enriched);

        } catch (error) {
            console.error("Gagal mengambil notifikasi:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Gagal memuat notifikasi.' });
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchRequests();
    }, [user]);

    const handleResponse = async (requestId: string, status: 'approved' | 'rejected') => {
        const originalRequests = [...requests];
        
        // Optimistically update UI
        setRequests(prev => prev.map(r => r.id === requestId ? {...r, status: status} : r));

        try {
            await mockApi.updateSwapRequestStatus(requestId, status);
            toast({
                title: 'Sukses',
                description: `Permintaan tukar telah di${status === 'approved' ? 'setujui' : 'tolak'}.`
            });
            fetchRequests(); // Re-fetch to confirm
        } catch (error) {
            // Revert UI on error
            setRequests(originalRequests);
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

    if (requests.length === 0) {
        return (
            <Card>
                <CardContent className="p-6">
                    <p className="text-center text-muted-foreground">Tidak ada notifikasi saat ini.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            {requests.map(req => (
                <Card key={req.id}>
                    <CardHeader>
                        <CardTitle className='text-lg flex justify-between items-center'>
                            <span>Permintaan Tukar Jadwal</span>
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
                                <p className="font-semibold">{req.fromUser.name} (Anda)</p>
                                <p className="text-sm text-muted-foreground">{format(parseISO(req.fromDuty.date), 'PPPP', {locale: idLocale})}</p>
                           </div>
                           <div>
                                <p className="font-semibold">{req.toUser.name}</p>
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
            ))}
        </div>
    )
}
