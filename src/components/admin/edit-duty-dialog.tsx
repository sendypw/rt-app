"use client"

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import type { Duty, User } from '@/lib/types';
import { mockApi } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

const formSchema = z.object({
  userId: z.string().min(1, 'Warga harus diisi'),
  date: z.date({
    required_error: 'Tanggal harus diisi.',
  }),
});

interface EditDutyDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    duty: Duty | null;
    users: User[];
}

export function EditDutyDialog({ isOpen, onClose, onSave, duty, users }: EditDutyDialogProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: duty?.userId || '',
      date: duty ? new Date(duty.date) : new Date(),
    },
  });
  
  useEffect(() => {
    form.reset({
      userId: duty?.userId || '',
      date: duty ? new Date(duty.date) : new Date(),
    })
  }, [duty, form])


  async function onSubmit(values: z.infer<typeof formSchema>) {
    const dutyData = {
        userId: values.userId,
        date: format(values.date, 'yyyy-MM-dd'),
    };
    
    try {
        if (duty) {
            await mockApi.updateDuty(duty.id, dutyData);
            toast({ title: 'Sukses', description: 'Jadwal tugas telah diperbarui.' });
        } else {
            await mockApi.addDuty(dutyData);
            toast({ title: 'Sukses', description: 'Jadwal tugas baru telah ditambahkan.' });
        }
        onSave();
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Gagal menyimpan jadwal tugas.' });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{duty ? 'Ubah Tugas' : 'Tambah Tugas Baru'}</DialogTitle>
                <DialogDescription>
                    {duty ? 'Perbarui detail untuk tugas ini.' : 'Berikan tugas baru kepada seorang warga.'}
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid gap-4 py-4">
                        <FormField
                            control={form.control}
                            name="userId"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Warga</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih seorang warga" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {users.map(user => (
                                        <SelectItem key={user.id} value={user.id}>{user.name} ({user.houseNumber})</SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                <FormLabel>Tanggal Tugas</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                        variant={'outline'}
                                        className={cn(
                                            'w-full pl-3 text-left font-normal',
                                            !field.value && 'text-muted-foreground'
                                        )}
                                        >
                                        {field.value ? (
                                            format(field.value, 'PPP', { locale: idLocale })
                                        ) : (
                                            <span>Pilih tanggal</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        locale={idLocale}
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date < new Date(new Date().setHours(0,0,0,0))
                                        }
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={onClose}>Batal</Button>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}
