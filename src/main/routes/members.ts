import { ipcMain } from 'electron';
import { GymService } from '../services/gymStatsService';
import { MemberService } from '../services/memberService';

ipcMain.handle('fetchMembers', async (_event, { email }) => {
  try {
    if (!email) throw new Error("Email is required.");
    const gymId = await GymService.getGymIdByEmail(email);
    const members = await MemberService.getAllMembers(gymId);
    return members;
  } catch (err) {
    console.error('Failed to fetch members:', err);
    return [];
  }
});
ipcMain.handle('addMember', async (_event, data) => {
  try {
    if (!data || !data.ownerEmail) throw new Error("Missing data or ownerEmail");

    const gymId = await GymService.getGymIdByEmail(data.ownerEmail);
    if (!gymId) throw new Error("Gym ID not found");

    const newMember = {
      id:data.id,
      gymId: Number(gymId),
      fullName: data.fullName ?? '',
      serialNumber: data.serialNumber ?? '',
      phone: data.phone,
      email: data.email,
      pfpUrl: data.pfpUrl || "/profile-round-1345-svgrepo-com.svg",
      plan: data.plan ?? '',
      subscriptionStart: data.subscriptionStart ?? new Date(),
      subscriptionEnd: data.subscriptionEnd ?? new Date(),
    };

    await MemberService.createMember(newMember);
    return { success: true };
  } catch (error) {
    console.error('Error in addMember:', error);
    return { success: false, error: String(error) };
  }
});
ipcMain.handle('deleteMember', async (_event, memberId: number) => {
  try {
    await MemberService.deleteMember(memberId);
    return { success: true };
  } catch (err) {
    console.error("Failed to delete member:", err);
    return { success: false, error: err.message };
  }
});



