export interface Payment  {
id: number;
    memberName: string;
    planName: string;
    amount: number;
    paidAt: string;
    expiresAt: string;
    status: "paid" | "unpaid";
}