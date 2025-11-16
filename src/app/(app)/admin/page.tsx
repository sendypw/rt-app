import { ScheduleManager } from '@/components/admin/schedule-manager';

export default function AdminPage() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">Admin Panel</h1>
                <p className="text-muted-foreground">Manage duty schedules for all residents.</p>
            </div>
            <ScheduleManager />
        </div>
    );
}
