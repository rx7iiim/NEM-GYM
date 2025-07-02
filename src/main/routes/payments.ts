import { ipcMain } from 'electron';
import { paymentService } from '../services/paymentService';
import { GymService } from '../services/gymStatsService';


// Fetch all payments by gym owner email
ipcMain.handle('fetchPayments', async (_, args: { email: string }) => {
  return await paymentService.fetchPayments(args.email);
});

// Add a new payment
ipcMain.handle('addPayment', async (_, data: {
  email:string;
  memberId: number;
  amount: number;
  expiresAt: string;
}) => {
    const gymId=await GymService.getGymIdByEmail(data.email)
  return await paymentService.addPayment({
    email:data.email,
    gymId: gymId,
    memberId: data.memberId,
    amount: data.amount,
    expiresAt: data.expiresAt,

  });
});

// Get one payment by ID
ipcMain.handle('getPaymentById', async (_, id: number) => {
  return await paymentService.getPaymentById(id);
});

// Update a payment
ipcMain.handle('updatePayment', async (_, payload: {
  id: number;
  update: Partial<{ amount: number; expiresAt: string }>
}) => {
  return await paymentService.updatePayment(payload.id, payload.update);
});

// Delete a payment
ipcMain.handle('deletePayment', async (_, email: string) => {
  const id = await GymService.getGymIdByEmail(email)
  return await paymentService.deletePayment(id);
});
