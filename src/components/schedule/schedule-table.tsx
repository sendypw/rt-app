"use client"

import { useEffect, useState } from 'react';
import { mockApi } from '@/lib/data';
import type { Duty, User } from '@/lib/types';
import { useAuth } from '@/lib/hooks/use-auth';
import { format, parseISO, isPast } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft, Check, Loader2, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '@/hooks/use-toast';
import { SwapRequestDialog } from './swap-request-dialog';

type EnrichedDuty = Duty & { user: User | undefined };

export function ScheduleTable() {
    const { user: currentUser } = useAuth();
    const { toast } = useToast();
    const [duties, setDuties] = useState<EnrichedDuty[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSwapDialogOpen, setIsSwapDialogOpen] = useState(false);
    const [selectedDuty, setSelectedDuty] = useState<EnrichedDuty | null>(null);

    const fetchSchedule = async () => {
        setLoading(true);
        try {
            const [dutiesData, usersData] = await Promise.all([
                mockApi.getSchedule(),
                mockApi.getUsers(),
            ]);

            const enrichedDuties = dutiesData.map(duty => ({
                ...duty,
                user: usersData.find(u => u.id === duty.userId)
            })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            
            setDuties(enrichedDuties);
        } catch (error) {
            console.error("Failed to fetch schedule", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSchedule();
    }, []);

    const openSwapDialog = (duty: EnrichedDuty) => {
        setSelectedDuty(duty);
        setIsSwapDialogOpen(true);
    }
    
    const handleSwapRequest = async (reason: string) => {
        if (!currentUser || !selectedDuty) return;

        const fromDuty = duties.find(d => d.userId === currentUser.id && !isPast(parseISO(d.date)));
        
        if (!fromDuty) {
            toast({
                variant: 'destructive',
                title: 'Permintaan Tukar Gagal',
                description: 'Tidak dapat menemukan jadwal tugas mendatang yang valid untuk ditukar.'
            });
            return;
        }

        await mockApi.createSwapRequest({
            fromDutyId: fromDuty.id,
            toDutyId: selectedDuty.id,
            fromUserId: currentUser.id,
            toUserId: selectedDuty.userId!,
            reason: reason,
        });
        
        toast({
            title: 'Permintaan Tukar Terkirim',
            description: `Permintaan Anda untuk bertukar dengan ${selectedDuty.user?.name} telah terkirim.`,
        });
        setIsSwapDialogOpen(false);
    }

    if (loading) {
        return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Tugas Mendatang</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                <Table className="min-w-[800px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Hari</TableHead>
                            <TableHead>Warga</TableHead>
                            <TableHead>No. Rumah</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {duties.map(duty => (
                            <TableRow key={duty.id} className={duty.userId === currentUser?.id ? 'bg-primary/10' : ''}>
                                <TableCell className="font-medium">{format(parseISO(duty.date), 'dd MMMM yyyy', { locale: idLocale })}</TableCell>
                                <TableCell>{format(parseISO(duty.date), 'EEEE', { locale: idLocale })}</TableCell>
                                <TableCell>{duty.user?.name || 'N/A'}</TableCell>
                                <TableCell>{duty.user?.houseNumber || 'N/A'}</TableCell>
                                <TableCell>
                                    <Badge variant={duty.attended ? 'default' : 'secondary'} className={duty.attended ? 'bg-green-500' : ''}>
                                        {duty.attended ? <Check className="mr-1 h-3 w-3"/> : <X className="mr-1 h-3 w-3"/>}
                                        {duty.attended ? 'Hadir' : 'Menunggu'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {duty.userId !== currentUser?.id && !isPast(parseISO(duty.date)) && (
                                         <Button variant="ghost" size="sm" onClick={() => openSwapDialog(duty)}>
                                            <ArrowRightLeft className="mr-2 h-4 w-4" />
                                            Minta Tukar
                                         </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            {selectedDuty && (
                 <SwapRequestDialog
                    isOpen={isSwapDialogOpen}
                    onClose={() => setIsSwapDialogOpen(false)}
                    onSubmit={handleSwapRequest}
                    toUser={selectedDuty.user!}
                 />
            )}
        </Card>
    );
}
