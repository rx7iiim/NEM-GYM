import { app, BrowserWindow } from 'electron';
import * as dotenv from 'dotenv';


import { db } from './db/index';
import './routes/auth';
import './routes/dashboard';
import './routes/members'
import './routes/payments'
import './routes/notif'

// These are Webpack-provided globals for loading the frontend and preload script
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Load environment variables
dotenv.config();

// ✅ Optional: verify DB connection at startup
db; // Ensures DB module executes (including connection test if present)

// 🪟 Create the Electron window
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // 👇 Load your frontend (React) through Webpack's bundled entry
  win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
}

// 🧠 Handle Windows shortcut cleanup if using Squirrel installer
if (require('electron-squirrel-startup')) {
  app.quit();
}

// 🚀 When Electron is ready
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// ❌ Quit on all windows closed (except macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  const { session } = require('electron')
  session.defaultSession.clearStorageData({
    storages: ['localstorage', 'cookies', 'indexdb']
  }).then(() => {
    console.log('Storage cleared on app quit')
  })
})