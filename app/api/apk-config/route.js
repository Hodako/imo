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

export async function GET() {
  try {
    const data = getStoredConfig();
    return NextResponse.json({ apkUrl: data.apkUrl || '', adminPassword: data.adminPassword || DEFAULT_PASSWORD });
  } catch {
    return NextResponse.json({ apkUrl: '', adminPassword: DEFAULT_PASSWORD });
  }
}

export async function POST(request) {
  try {
    const config = getStoredConfig();
    const body = await request.json();
    const apkUrl = body.apkUrl ?? '';
    config.apkUrl = apkUrl;
    
    const dir = path.dirname(CONFIG_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
    
    return NextResponse.json({ success: true, apkUrl });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
