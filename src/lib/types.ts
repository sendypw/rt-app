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

export interface EnrichedSwapRequest extends SwapRequest {
  fromUser: User;
  toUser: User;
  fromDuty: Duty;
  toDuty: Duty;
}

export type NotificationType = 'swap_request' | 'duty_reminder';

export interface BaseNotification {
    id: string;
    type: NotificationType;
    createdAt: string;
}

export interface SwapRequestNotification extends BaseNotification {
    type: 'swap_request';
    swapRequest: EnrichedSwapRequest;
}

export interface DutyReminderNotification extends BaseNotification {
    type: 'duty_reminder';
    duty: Duty;
    user: User;
}

export type Notification = SwapRequestNotification | DutyReminderNotification;
