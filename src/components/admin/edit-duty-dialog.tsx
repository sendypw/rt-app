"use client"

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns'
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
  userId: z.string().min(1, 'Resident is required'),
  date: z.date({
    required_error: 'A date is required.',
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
            toast({ title: 'Success', description: 'Duty has been updated.' });
        } else {
            await mockApi.addDuty(dutyData);
            toast({ title: 'Success', description: 'New duty has been added.' });
        }
        onSave();
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to save duty.' });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{duty ? 'Edit Duty' : 'Add New Duty'}</DialogTitle>
                <DialogDescription>
                    {duty ? 'Update the details for this duty.' : 'Assign a new duty to a resident.'}
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
                                <FormLabel>Resident</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a resident" />
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
                                <FormLabel>Duty Date</FormLabel>
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
                                            format(field.value, 'PPP')
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
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
                        <Button variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}
