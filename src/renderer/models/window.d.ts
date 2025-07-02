import { Notification } from "./notifications";
import { Payment } from "./payments";
export {};

declare global {
  interface Window {
    electronAPI?: {
      login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; token?: string }>;
      signup: (data: { email: string; username: string; password: string }) => Promise<{ success: boolean; message?: string }>;
      fetchDashboard: (data: { email: string }) => Promise<{
      totalincome: number;
    monthlyIncome: number;
    ActiveMembers: number;
    allMembers: number;
      recentPayments:Payment[];
    
      }>;
      fetchMembers: (data: { email: string }) => Promise<Member[]>;
      addMember: (data: {
    id:number;
    ownerEmail:string;
    fullName: string;
    serialNumber: string;
    phone?: string;
    email?: string;
    pfpUrl?: string;
    plan: string;
    subscriptionStart?: Date;
    subscriptionEnd?: Date;
       
      }) => Promise<{ success: boolean; error?: string }>;
     deleteMember: (id: number) => Promise<{ success: boolean; error?: string }>;

      fetchPayments: (data: { email: string }) => Promise<{
        id: number;
        memberName: string;
        planName: string;
        amount: number;
        paidAt: string;
        expiresAt: string;
        status: 'paid' | 'unpaid';
      }[]>;
      addPayment: (data: {
        email:string
        memberId: number;
        amount: number;
        expiresAt: string;
      }) => Promise<{ success: boolean }>;

       fetchNotifications: (data: { email: string }) => Promise<Notification[]>;

      checkForExpiredPayments: (data :{email:string}) => Promise<{succes: boolean , count: number }>;

      onAuthError?: (callback: (message: string) => void) => void;
    };
  }
}
