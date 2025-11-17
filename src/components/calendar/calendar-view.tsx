"use client";

import { useState, useEffect } from 'react';
import { mockApi } from '@/lib/data';
import type { Duty, User } from '@/lib/types';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, parseISO } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

type EnrichedDuty = Duty & { user: User | undefined };

export function CalendarView() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [duties, setDuties] = useState<EnrichedDuty[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchedule = async () => {
            setLoading(true);
            try {
                const [dutiesData, usersData] = await Promise.all([
                    mockApi.getSchedule(),
                    mockApi.getUsers(),
                ]);

                const enrichedDuties = dutiesData.map(duty => ({
                    ...duty,
                    user: usersData.find(u => u.id === duty.userId)
                }));
                
                setDuties(enrichedDuties);
            } catch (error) {
                console.error("Failed to fetch schedule", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
    }, []);

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const dutiesByDate: { [key: string]: EnrichedDuty[] } = {};
    duties.forEach(duty => {
        const dateKey = duty.date;
        if (!dutiesByDate[dateKey]) {
            dutiesByDate[dateKey] = [];
        }
        dutiesByDate[dateKey].push(duty);
    });

    const prevMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const weekDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{format(currentDate, 'MMMM yyyy', { locale: idLocale })}</CardTitle>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={prevMonth}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={nextMonth}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                     <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                ) : (
                    <div className="grid grid-cols-7 gap-1">
                        {weekDays.map(day => (
                            <div key={day} className="text-center font-bold text-muted-foreground text-sm p-2">{day}</div>
                        ))}
                        {days.map(day => {
                            const dateKey = format(day, 'yyyy-MM-dd');
                            const dayDuties = dutiesByDate[dateKey] || [];
                            return (
                                <div
                                    key={day.toString()}
                                    className={cn(
                                        "border rounded-lg p-2 h-36 flex flex-col",
                                        !isSameMonth(day, monthStart) && "bg-muted/50 text-muted-foreground",
                                        isToday(day) && "bg-primary/10 border-primary"
                                    )}
                                >
                                    <span className={cn("font-semibold", isToday(day) && "text-primary")}>{format(day, 'd')}</span>
                                    <div className="flex-grow overflow-y-auto space-y-1 mt-1 text-xs">
                                        <TooltipProvider>
                                            {dayDuties.map(duty => (
                                                <Tooltip key={duty.id}>
                                                    <TooltipTrigger asChild>
                                                        <Badge variant={duty.attended ? 'default' : 'secondary'} className={cn("w-full text-left justify-start truncate", duty.attended ? 'bg-green-500' : '')}>
                                                            {duty.user?.name}
                                                        </Badge>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{duty.user?.name} ({duty.user?.houseNumber})</p>
                                                        <p>Status: {duty.attended ? 'Hadir' : 'Menunggu'}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            ))}
                                        </TooltipProvider>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
