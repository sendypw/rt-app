"use client";

import { useEffect, useState } from 'react';
import { mockApi } from '@/lib/data';
import type { Duty, User } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle, Pencil, Trash2, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { EditDutyDialog } from './edit-duty-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';

type EnrichedDuty = Duty & { user?: User };

export function ScheduleManager() {
    const [duties, setDuties] = useState<EnrichedDuty[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDuty, setSelectedDuty] = useState<EnrichedDuty | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    const fetchAllData = async () => {
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
            setUsers(usersData.filter(u => u.role === 'warga'));
        } catch (error) {
            console.error("Failed to fetch schedule", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleOpenDialog = (duty: EnrichedDuty | null = null) => {
        setSelectedDuty(duty);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedDuty(null);
    };

    const handleSave = async () => {
        await fetchAllData();
        handleCloseDialog();
    };

    const handleDelete = async (dutyId: string) => {
        const success = await mockApi.deleteDuty(dutyId);
        if (success) {
            toast({ title: 'Success', description: 'Duty has been deleted.' });
            await fetchAllData();
        } else {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete duty.' });
        }
    }

    if (loading) {
        return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Manage Schedule</CardTitle>
                <Button size="sm" onClick={() => handleOpenDialog()}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Duty
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Resident</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {duties.map(duty => (
                            <TableRow key={duty.id}>
                                <TableCell className="font-medium">{format(parseISO(duty.date), 'PPPP')}</TableCell>
                                <TableCell>{duty.user?.name || 'N/A'}</TableCell>
                                <TableCell>
                                    <Badge variant={duty.attended ? 'default' : 'secondary'} className={duty.attended ? 'bg-green-500' : ''}>
                                        {duty.attended ? <Check className="mr-1 h-3 w-3"/> : <X className="mr-1 h-3 w-3"/>}
                                        {duty.attended ? 'Attended' : 'Pending'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(duty)}>
                                        <Pencil className="h-4 w-4" />
                                        <span className="sr-only">Edit</span>
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">Delete</span>
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the duty scheduled for {duty.user?.name} on {format(parseISO(duty.date), 'PPPP')}.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(duty.id)}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            {isDialogOpen && (
                <EditDutyDialog
                    isOpen={isDialogOpen}
                    onClose={handleCloseDialog}
                    onSave={handleSave}
                    duty={selectedDuty}
                    users={users}
                />
            )}
        </Card>
    );
}
