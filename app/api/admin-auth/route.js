import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONFIG_PATH = path.join(process.cwd(), 'data', 'apk-config.json');
const DEFAULT_PASSWORD = 'admin123';

function getStoredConfig() {
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

function saveConfig(data) {
  const dir = path.dirname(CONFIG_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// POST: Login verification
export async function POST(request) {
  try {
    const body = await request.json();
    const { password } = body;
    const config = getStoredConfig();

    if (!password) {
      return NextResponse.json({ success: false, error: 'Password is required' }, { status: 400 });
    }

    if (password === config.adminPassword) {
      return NextResponse.json({ success: true, message: 'Authentication successful' });
    } else {
      return NextResponse.json({ success: false, error: 'Incorrect password' }, { status: 401 });
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PUT: Change password
export async function PUT(request) {
  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;
    const config = getStoredConfig();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, error: 'Both current and new password are required' }, { status: 400 });
    }

    if (currentPassword !== config.adminPassword) {
      return NextResponse.json({ success: false, error: 'Current password is incorrect' }, { status: 401 });
    }

    if (newPassword.length < 4) {
      return NextResponse.json({ success: false, error: 'New password must be at least 4 characters long' }, { status: 400 });
    }

    config.adminPassword = newPassword;
    saveConfig(config);

    return NextResponse.json({ success: true, message: 'Password updated successfully!' });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
