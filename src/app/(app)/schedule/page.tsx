"use client";

import { useState } from 'react';
import { ScheduleTable } from '@/components/schedule/schedule-table';
import { ScheduleCalendar } from '@/components/schedule/schedule-calendar';
import { Button } from '@/components/ui/button';
import { List, Calendar } from 'lucide-react';

type ViewMode = 'table' | 'calendar';

export default function SchedulePage() {
    const [viewMode, setViewMode] = useState<ViewMode>('table');

    return (
        <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline">Jadwal Tugas</h1>
                    <p className="text-muted-foreground">Lihat, kelola, dan atur jadwal siskamling Anda.</p>
                </div>
                <div className='flex items-center gap-2'>
                    <Button 
                        variant={viewMode === 'table' ? 'default' : 'outline'} 
                        size="icon" 
                        onClick={() => setViewMode('table')}
                        aria-label="Tampilan Tabel"
                    >
                        <List className="h-4 w-4" />
                    </Button>
                    <Button 
                        variant={viewMode === 'calendar' ? 'default' : 'outline'} 
                        size="icon" 
                        onClick={() => setViewMode('calendar')}
                        aria-label="Tampilan Kalender"
                    >
                        <Calendar className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {viewMode === 'table' ? <ScheduleTable /> : <ScheduleCalendar />}
        </div>
    );
}
