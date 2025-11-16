import { LoginForm } from '@/components/auth/login-form';
import { ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
            <ShieldCheck className="h-12 w-12 text-primary" />
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground font-headline">
                Aplikasi Jaga RT
            </h1>
            <p className="text-muted-foreground">Selamat datang kembali! Silakan masuk.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
