import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const SITE_CONFIG_PATH = path.join(process.cwd(), 'data', 'site-config.json');
const APK_CONFIG_PATH = path.join(process.cwd(), 'data', 'apk-config.json');
const DEFAULT_PASSWORD = 'admin123';

function getApkConfig() {
  let apkUrl = '';
  let adminPassword = DEFAULT_PASSWORD;

  // 1. Try unified site-config.json first
  if (fs.existsSync(SITE_CONFIG_PATH)) {
    try {
      const raw = fs.readFileSync(SITE_CONFIG_PATH, 'utf-8');
      const data = JSON.parse(raw);
      if (data.apk?.apkUrl) apkUrl = data.apk.apkUrl;
      else if (data.apkUrl) apkUrl = data.apkUrl;
      if (data.adminPassword) adminPassword = data.adminPassword;
    } catch {
      // fallback
    }
  }

  // 2. Fallback to apk-config.json if not found
  if (!apkUrl && fs.existsSync(APK_CONFIG_PATH)) {
    try {
      const raw = fs.readFileSync(APK_CONFIG_PATH, 'utf-8');
      const data = JSON.parse(raw);
      if (data.apkUrl) apkUrl = data.apkUrl;
      if (data.adminPassword) adminPassword = data.adminPassword;
    } catch {
      // fallback
    }
  }

  return { apkUrl, adminPassword };
}

export async function GET() {
  try {
    const data = getApkConfig();
    return NextResponse.json({ apkUrl: data.apkUrl || '', adminPassword: data.adminPassword });
  } catch {
    return NextResponse.json({ apkUrl: '', adminPassword: DEFAULT_PASSWORD });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const apkUrl = body.apkUrl ?? '';

    // Update site-config.json
    if (fs.existsSync(SITE_CONFIG_PATH)) {
      try {
        const raw = fs.readFileSync(SITE_CONFIG_PATH, 'utf-8');
        const data = JSON.parse(raw);
        if (!data.apk) data.apk = {};
        data.apk.apkUrl = apkUrl;
        data.apkUrl = apkUrl;
        fs.writeFileSync(SITE_CONFIG_PATH, JSON.stringify(data, null, 2), 'utf-8');
      } catch {}
    }

    // Update apk-config.json
    const dir = path.dirname(APK_CONFIG_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(APK_CONFIG_PATH, JSON.stringify({ apkUrl, adminPassword: DEFAULT_PASSWORD }, null, 2), 'utf-8');

    return NextResponse.json({ success: true, apkUrl });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
