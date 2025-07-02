// src/main/ipc/auth.ts
import { ipcMain } from 'electron';
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createUser, getUserByEmail } from '../services/userService';
import dotenv from 'dotenv';

dotenv.config();



ipcMain.handle('auth:login', async (_event, { email, password }) => {
  const user = await getUserByEmail(email);
  if (!user) {
    return { success: false, error: 'User not found' };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { success: false, error: 'Invalid credentials' };
  }

// Then cast secret explicitly:
const token = jwt.sign(
  { id: user.id },
  process.env.JWT_SECRET as string,
  { expiresIn: '1d' }
);


  return {
    success: true,
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
    },
  };
});

ipcMain.handle('auth:signup', async (_event, data: { email: string; username: string; password: string }) => {
  const { email, username, password } = data;


  try {
    
    if (!email.includes('@') || username.trim().length < 3 || password.length < 8) {
      return { success: false, message: 'Invalid input. Check email, username, or password.' };
    }


    if (await getUserByEmail(email)) {
      return { success: false, message: 'Email or username already exists.' };
    }


    const newUser = await createUser(email, username, password);
    return { success: true, user: newUser };
  } catch (err) {
    console.error('[Signup Error]', err);
    return { success: false, message: 'Signup failed due to server error.' };
  }
});

