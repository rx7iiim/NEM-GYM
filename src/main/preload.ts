import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  login: (credentials: { email: string; password: string }) =>
    ipcRenderer.invoke('auth:login', credentials),
  signup:(data:{email:string ;username:string ; password:string})=>
    ipcRenderer.invoke('auth:signup',data),
 fetchDashboard: (data: { email: string }) =>
  ipcRenderer.invoke('fetchDashboard', data),
fetchMembers: (data: { email: string }) => ipcRenderer.invoke('fetchMembers', data),

addMember: (data: {
  id:number;
  ownerEmail: string;
  fullName: string;
  serialNumber: string;
  phone?: string;
  email?: string;
  pfpUrl?: string;
  plan: string;
  subscriptionStart?: string;
  subscriptionEnd?: string;
}) => ipcRenderer.invoke('addMember', data),
deleteMember: (id: number) => ipcRenderer.invoke('deleteMember', id),


fetchPayments: (data: { email: string }) =>
    ipcRenderer.invoke('fetchPayments', data),

  addPayment: (data: {
    email:string;
    memberId: number;
    amount: number;
    expiresAt: string;
  }) => ipcRenderer.invoke('addPayment', data),


   fetchNotifications: (data: { email: string }) =>
    ipcRenderer.invoke('fetchNotifications', data),

  checkForExpiredPayments: () =>
    ipcRenderer.invoke('checkForExpiredPayments'),


  
  onAuthError: (callback: (message: string) => void) => {
    ipcRenderer.on('auth:error', (_, msg) => callback(msg));
  
  
  }
});
