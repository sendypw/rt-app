import { CalendarView } from "@/components/calendar/calendar-view";

export default function CalendarPage() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">Kalender Tugas</h1>
                <p className="text-muted-foreground">Lihat jadwal tugas siskamling dalam format kalender.</p>
            </div>
            <CalendarView />
        </div>
    );
}
