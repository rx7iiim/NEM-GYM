export interface Member {
  id:number;
    ownerEmail:string,
    fullName: string;
    serialNumber: string;
    phone?: string;
    email?: string;
    pfpUrl?: string;
    plan: string;
    subscriptionStart?: Date;
    subscriptionEnd?: Date;
}