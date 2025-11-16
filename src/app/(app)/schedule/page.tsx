import { ScheduleTable } from '@/components/schedule/schedule-table';

export default function SchedulePage() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">Duty Schedule</h1>
                <p className="text-muted-foreground">Full community watch schedule for the upcoming month.</p>
            </div>
            <ScheduleTable />
        </div>
    );
}
