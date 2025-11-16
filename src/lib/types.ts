export interface User {
  id: string;
  houseNumber: string;
  name: string;
  role: 'admin' | 'warga';
}

export interface Duty {
  id: string;
  userId: string;
  date: string; // ISO date string YYYY-MM-DD
  attended: boolean;
}

export interface Report {
  id: string;
  dutyId: string;
  userId: string;
  content: string;
  photo?: string; // data URL of the image
  submittedAt: string; // ISO date-time string
}

export interface SwapRequest {
  id: string;
  fromDutyId: string;
  toDutyId: string;
  fromUserId: string;
  toUserId: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}
