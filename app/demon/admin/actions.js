'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';

const CONFIG_PATH = path.join(process.cwd(), 'data', 'apk-config.json');
const DEFAULT_PASSWORD = 'admin123';

export async function getStoredConfig() {
  const dir = path.dirname(CONFIG_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CONFIG_PATH)) {
    const initial = { apkUrl: '', adminPassword: DEFAULT_PASSWORD };
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
    const data = JSON.parse(raw);
    if (!data.adminPassword) {
      data.adminPassword = DEFAULT_PASSWORD;
      fs.writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2), 'utf-8');
    }
    return data;
  } catch {
    return { apkUrl: '', adminPassword: DEFAULT_PASSWORD };
  }
}

export async function saveStoredConfig(data) {
  const dir = path.dirname(CONFIG_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export async function loginAdmin(prevState, formData) {
  try {
    let password = '';
    if (formData instanceof FormData) {
      password = formData.get('password') || '';
    } else if (typeof formData === 'string') {
      password = formData;
    } else if (formData && typeof formData === 'object') {
      password = formData.password || '';
    }

    const config = await getStoredConfig();
    const correctPassword = config.adminPassword || DEFAULT_PASSWORD;

    if (password.trim() === correctPassword) {
      const cookieStore = await cookies();
      cookieStore.set('imo_admin_session', 'true', {
        httpOnly: false,
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: 'lax',
      });
      revalidatePath('/demon/admin');
      return { success: true };
    } else {
      return { success: false, error: 'Incorrect password. Default is: admin123' };
    }
  } catch (err) {
    return { success: false, error: err.message || 'Login failed' };
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('imo_admin_session');
  cookieStore.set('imo_admin_session', '', {
    path: '/',
    maxAge: 0,
  });
  revalidatePath('/demon/admin');
  return { success: true };
}

export async function saveApkUrlAction(newUrl) {
  const cookieStore = await cookies();
  const isAuthed = cookieStore.get('imo_admin_session')?.value === 'true';
  if (!isAuthed) return { success: false, error: 'Unauthorized' };

  const config = await getStoredConfig();
  config.apkUrl = (newUrl || '').trim();
  await saveStoredConfig(config);
  revalidatePath('/demon/admin');
  revalidatePath('/');
  return { success: true, apkUrl: config.apkUrl };
}

export async function changePasswordAction(currentPassword, newPassword) {
  const cookieStore = await cookies();
  const isAuthed = cookieStore.get('imo_admin_session')?.value === 'true';
  if (!isAuthed) return { success: false, error: 'Unauthorized' };

  const config = await getStoredConfig();
  const correctPassword = config.adminPassword || DEFAULT_PASSWORD;

  if (currentPassword !== correctPassword) {
    return { success: false, error: 'Current password is incorrect' };
  }
  if (!newPassword || newPassword.length < 4) {
    return { success: false, error: 'New password must be at least 4 characters long' };
  }

  config.adminPassword = newPassword;
  await saveStoredConfig(config);
  revalidatePath('/demon/admin');
  return { success: true, message: 'Password updated successfully!' };
}
