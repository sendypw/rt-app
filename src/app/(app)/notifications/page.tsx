import { NotificationList } from "@/components/notifications/notification-list";

export default function NotificationsPage() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">Notifikasi</h1>
                <p className="text-muted-foreground">Kelola permintaan dan pemberitahuan Anda.</p>
            </div>
            <NotificationList />
        </div>
    );
}
