"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import type { User } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface SwapRequestDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reason: string) => Promise<void>;
    toUser: User;
}

export function SwapRequestDialog({ isOpen, onClose, onSubmit, toUser }: SwapRequestDialogProps) {
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        await onSubmit(reason);
        setIsSubmitting(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Minta Tukar Jadwal</DialogTitle>
                    <DialogDescription>
                        Kirim permintaan untuk bertukar jadwal dengan {toUser.name}. Harap berikan alasan permintaan Anda.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid w-full gap-1.5">
                        <Label htmlFor="reason">Alasan</Label>
                        <Textarea 
                            id="reason" 
                            placeholder="cth., Saya ada urusan keluarga yang tidak bisa ditinggalkan."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)} 
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={onClose}>Batal</Button>
                    <Button onClick={handleSubmit} disabled={!reason || isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Kirim Permintaan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
