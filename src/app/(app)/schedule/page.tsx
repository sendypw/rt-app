import { ScheduleTable } from '@/components/schedule/schedule-table';

export default function SchedulePage() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">Jadwal Tugas</h1>
                <p className="text-muted-foreground">Jadwal siskamling lengkap untuk bulan mendatang.</p>
            </div>
            <ScheduleTable />
        </div>
    );
}
