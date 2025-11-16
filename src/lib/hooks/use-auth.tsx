
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';
import { mockApi } from '@/lib/data';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (houseNumber: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for user in localStorage to persist session
    try {
      const storedUser = localStorage.getItem('jaga-rt-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('jaga-rt-user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (houseNumber: string, password: string) => {
    setLoading(true);
    // Static password check as per requirements
    if (password === 'password123') {
      const users = await mockApi.getUsers();
      const foundUser = users.find(u => u.houseNumber.toLowerCase() === houseNumber.toLowerCase());
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('jaga-rt-user', JSON.stringify(foundUser));
        setLoading(false);
        return true;
      }
    }
    setLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jaga-rt-user');
    router.push('/login');
  };

  const value = { user, loading, login, logout };

  // This check was removed in the previous turn, but it's important to keep the app from showing a blank screen while loading.
  // We'll let the child components decide whether to show a loader or not based on the loading state.
  // However, the initial loading of the auth state should be handled here to prevent flicker.
  if (loading) {
     return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
