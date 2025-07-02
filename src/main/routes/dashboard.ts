import { ipcMain } from "electron";
import { GymService } from "../services/gymStatsService";



ipcMain.handle('fetchDashboard', async (_event, { email }) => {
  try {
    return GymService.getStatsByEmail(email)
  }

   catch (error) {
    console.error('[Dashboard] Error fetching dashboard:', error);
    throw new Error('Failed to fetch dashboard data');
  }
});
