"use client"

import { useEffect, useState } from 'react';
import { mockApi } from '@/lib/data';
import type { Duty, User } from '@/lib/types';
import { useAuth } from '@/lib/hooks/use-auth';
import { format, parseISO, isPast } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft, Check, Loader2, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '@/hooks/use-toast';

type EnrichedDuty = Duty & { user: User | undefined };

export function ScheduleTable() {
    const { user: currentUser } = useAuth();
    const { toast } = useToast();
    const [duties, setDuties] = useState<EnrichedDuty[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSchedule() {
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
        fetchSchedule();
    }, []);

    const handleSwapRequest = async (toDutyId: string) => {
        if (!currentUser) return;

        const fromDuty = duties.find(d => d.userId === currentUser.id && !isPast(parseISO(d.date)));
        const toDuty = duties.find(d => d.id === toDutyId);

        if (!fromDuty || !toDuty) {
            toast({
                variant: 'destructive',
                title: 'Swap Request Failed',
                description: 'Could not find a valid upcoming duty to swap from.'
            });
            return;
        }

        await mockApi.createSwapRequest({
            fromDutyId: fromDuty.id,
            toDutyId: toDuty.id,
            fromUserId: currentUser.id,
            toUserId: toDuty.userId
        });
        
        toast({
            title: 'Swap Request Sent',
            description: `Your request to swap with ${toDuty.user?.name} has been sent.`,
        });
    }

    if (loading) {
        return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Upcoming Duties</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Day</TableHead>
                            <TableHead>Resident</TableHead>
                            <TableHead>House No.</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {duties.map(duty => (
                            <TableRow key={duty.id} className={duty.userId === currentUser?.id ? 'bg-primary/10' : ''}>
                                <TableCell className="font-medium">{format(parseISO(duty.date), 'MMMM dd, yyyy')}</TableCell>
                                <TableCell>{format(parseISO(duty.date), 'EEEE')}</TableCell>
                                <TableCell>{duty.user?.name || 'N/A'}</TableCell>
                                <TableCell>{duty.user?.houseNumber || 'N/A'}</TableCell>
                                <TableCell>
                                    <Badge variant={duty.attended ? 'default' : 'secondary'} className={duty.attended ? 'bg-green-500' : ''}>
                                        {duty.attended ? <Check className="mr-1 h-3 w-3"/> : <X className="mr-1 h-3 w-3"/>}
                                        {duty.attended ? 'Attended' : 'Pending'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {duty.userId !== currentUser?.id && !isPast(parseISO(duty.date)) && (
                                         <Button variant="ghost" size="sm" onClick={() => handleSwapRequest(duty.id)}>
                                            <ArrowRightLeft className="mr-2 h-4 w-4" />
                                            Request Swap
                                         </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
