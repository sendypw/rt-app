import type { User, Duty, Report, SwapRequest } from './types';
import { addDays, format } from 'date-fns';

// --- MOCK USERS ---
const users: User[] = [
  { id: 'user-1', houseNumber: 'A1', name: 'Budi Santoso', role: 'admin' },
  { id: 'user-2', houseNumber: 'A2', name: 'Citra Lestari', role: 'warga' },
  { id: 'user-3', houseNumber: 'A3', name: 'Doni Wijaya', role: 'warga' },
  { id: 'user-4', houseNumber: 'B1', name: 'Eka Putri', role: 'warga' },
  { id: 'user-5', houseNumber: 'B2', name: 'Fajar Nugraha', role: 'warga' },
  { id: 'user-6', houseNumber: 'B3', name: 'Gita Permata', role: 'warga' },
];

// --- MOCK DUTY SCHEDULE ---
let duties: Duty[] = [];
const startDate = new Date();
const wargaUsers = users.filter(u => u.role === 'warga');

for (let i = 0; i < 30; i++) {
  const userIndex = i % wargaUsers.length;
  duties.push({
    id: `duty-${i + 1}`,
    userId: wargaUsers[userIndex].id,
    date: format(addDays(startDate, i), 'yyyy-MM-dd'),
    attended: false,
  });
}

// --- MOCK REPORTS AND SWAPS ---
let reports: Report[] = [];
let swapRequests: SwapRequest[] = [];

// --- MOCK API FUNCTIONS ---

export const mockApi = {
  getUsers: async (): Promise<User[]> => {
    return [...users];
  },
  getUserById: async (id: string): Promise<User | undefined> => {
    return users.find(u => u.id === id);
  },
  getSchedule: async (): Promise<Duty[]> => {
    return [...duties];
  },
  updateDuty: async (dutyId: string, updates: Partial<Duty>): Promise<Duty | undefined> => {
    const dutyIndex = duties.findIndex(d => d.id === dutyId);
    if (dutyIndex > -1) {
      duties[dutyIndex] = { ...duties[dutyIndex], ...updates };
      return duties[dutyIndex];
    }
    return undefined;
  },
  addDuty: async(newDutyData: Omit<Duty, 'id' | 'attended'>): Promise<Duty> => {
    const newDuty: Duty = {
      ...newDutyData,
      id: `duty-${Date.now()}`,
      attended: false,
    };
    duties.push(newDuty);
    duties.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return newDuty;
  },
  deleteDuty: async(dutyId: string): Promise<boolean> => {
    const initialLength = duties.length;
    duties = duties.filter(d => d.id !== dutyId);
    return duties.length < initialLength;
  },
  getReports: async (): Promise<Report[]> => {
    return [...reports];
  },
  submitReport: async (reportData: Omit<Report, 'id' | 'submittedAt'>): Promise<Report> => {
    const newReport: Report = {
      ...reportData,
      id: `report-${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };
    reports.push(newReport);
    return newReport;
  },
  getSwapRequests: async (): Promise<SwapRequest[]> => {
    return [...swapRequests];
  },
  createSwapRequest: async(requestData: Omit<SwapRequest, 'id' | 'status'>): Promise<SwapRequest> => {
    const newRequest: SwapRequest = {
      ...requestData,
      id: `swap-${Date.now()}`,
      status: 'pending',
    };
    swapRequests.push(newRequest);
    return newRequest;
  }
};
