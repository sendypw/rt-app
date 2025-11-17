
"use client"

import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { mockApi } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Loader2 } from "lucide-react";

type ChartData = {
  name: string;
  total: number;
};

export function Overview() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [users, duties] = await Promise.all([
          mockApi.getUsers(),
          mockApi.getSchedule(),
        ]);
        
        const wargaUsers = users.filter(u => u.role === 'warga');

        const dutiesPerUser = wargaUsers.map(user => {
          const userDuties = duties.filter(duty => duty.userId === user.id);
          return {
            name: user.name.split(" ")[0], // Use first name for brevity
            total: userDuties.length,
          };
        });

        setData(dutiesPerUser);
      } catch (error) {
        console.error("Failed to fetch overview data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="h-full flex flex-col">
        <CardHeader>
            <CardTitle>Ikhtisar</CardTitle>
            <CardDescription>Jumlah tugas siskamling per warga.</CardDescription>
        </CardHeader>
        <CardContent className="pl-2 flex-grow">
             {loading ? (
                <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
                ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                    <XAxis
                        dataKey="name"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                        allowDecimals={false}
                    />
                    <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
             )}
        </CardContent>
    </Card>
  )
}
