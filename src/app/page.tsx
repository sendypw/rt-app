"use client";

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ShieldCheck,
  Wallet,
  Users,
  Megaphone,
  Mail,
  Heart,
  Calendar,
  Store,
  Trash2,
  Flower2,
  Users2,
  Building,
  ArrowRight,
  MapPinHouse
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from "@/lib/hooks/use-auth";
import { UserNav } from "@/components/shared/user-nav";
import { cn } from '@/lib/utils';

const features = [
  {
    title: 'Siskamling',
    description: 'Lihat dan kelola jadwal jaga keamanan lingkungan.',
    href: '/schedule',
    icon: ShieldCheck,
    comingSoon: false,
  },
  {
    title: 'Keuangan & Iuran',
    description: 'Informasi iuran warga dan laporan keuangan RT.',
    href: '#',
    icon: Wallet,
    comingSoon: true,
  },
  {
    title: 'Data Warga',
    description: 'Database warga dan informasi mengenai hunian.',
    href: '#',
    icon: Users,
    comingSoon: true,
  },
  {
    title: 'Pengumuman',
    description: 'Pusat informasi dan pengumuman penting untuk warga.',
    href: '#',
    icon: Megaphone,
    comingSoon: true,
  },
  {
    title: 'Surat Pengantar',
    description: 'Ajukan surat pengantar untuk keperluan administrasi.',
    href: '#',
    icon: Mail,
    comingSoon: true,
  },
  {
    title: 'Bantuan Sosial',
    description: 'Program bantuan sosial dan pendataan warga.',
    href: '#',
    icon: Heart,
    comingSoon: true,
  },
  {
    title: 'Kalender Kegiatan',
    description: 'Jadwal kegiatan dan acara di lingkungan RT.',
    href: '#',
    icon: Calendar,
    comingSoon: true,
  },
  {
    title: 'Marketplace',
    description: 'Jual beli produk dan jasa antar warga.',
    href: '#',
    icon: Store,
    comingSoon: true,
  },
  {
    title: 'Bank Sampah',
    description: 'Kelola sampah dan dapatkan keuntungan.',
    href: '#',
    icon: Trash2,
    comingSoon: true,
  },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background p-3">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-4">
            <MapPinHouse className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold">Super App Warga</h1>
          </Link>
          {user && <UserNav />}
        </div>
        <div>
          <p className="text-muted-foreground">
            Satu aplikasi untuk semua kebutuhan warga. Mudah, cepat, dan terintegrasi.
          </p>
        </div>
      </header>

      <main className="w-full pb-8 px-3 pt-3">
        {/* Mobile View: Icon Grid */}
        <div className="grid grid-cols-3 gap-4 md:hidden">
          {features.map((feature) => {
            const isComingSoon = feature.comingSoon;
            const Wrapper = isComingSoon ? 'div' : Link;

            return (
              <Wrapper key={`${feature.title}-mobile`} href={feature.href}>
                <div
                  className={cn(
                    "flex aspect-square flex-col items-center justify-center rounded-lg border bg-card p-2 text-card-foreground shadow-sm transition-colors",
                    isComingSoon 
                      ? "cursor-not-allowed opacity-50" 
                      : "hover:bg-accent"
                  )}
                >
                  <feature.icon className="h-8 w-8 text-primary" />
                  <span className="mt-2 text-center text-sm font-semibold">
                    {feature.title}
                  </span>
                  {isComingSoon ? (
                      <Badge variant="outline">Segera</Badge>
                    ) : (
                      <Badge>Tersedia</Badge>
                    )}
                </div>
              </Wrapper>
            );
          })}
        </div>

        {/* Desktop View: Card Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature) => {
            const isComingSoon = feature.comingSoon;
            const CardLink = isComingSoon ? 'div' : Link;
            
            return (
              <Card
                key={feature.title}
                className={cn(
                  "flex transform flex-col justify-between transition-transform duration-300",
                  !isComingSoon && 'hover:-translate-y-1 hover:shadow-lg',
                  isComingSoon && 'cursor-not-allowed'
                )}
              >
                <CardLink href={feature.href} className="flex h-full flex-col">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-semibold">
                      {feature.title}
                    </CardTitle>
                    <feature.icon className="h-6 w-6 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                  <div className="m-6 mt-auto flex items-center justify-between pt-2">
                    {isComingSoon ? (
                      <Badge variant="outline">Segera Hadir</Badge>
                    ) : (
                      <Badge>Tersedia</Badge>
                    )}
                    {!isComingSoon && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                  </div>
                </CardLink>
              </Card>
            );
          })}
        </div>
      </main>

      <footer className="mt-12 border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} RT Online. All rights reserved.
        </div>
      </footer>
    </div>
  );
}