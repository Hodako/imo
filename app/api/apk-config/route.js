import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const SITE_CONFIG_PATH = path.join(process.cwd(), 'data', 'site-config.json');
const APK_CONFIG_PATH = path.join(process.cwd(), 'data', 'apk-config.json');
const DEFAULT_PASSWORD = 'admin123';

function getApkConfig() {
  let apkUrl = '';
  let fileName = '';
  let originalName = '';
  let fileSize = '';
  let appName = '';
  let adminPassword = DEFAULT_PASSWORD;

  // 1. Try unified site-config.json first
  if (fs.existsSync(SITE_CONFIG_PATH)) {
    try {
      const raw = fs.readFileSync(SITE_CONFIG_PATH, 'utf-8');
      const data = JSON.parse(raw);
      if (data.apk?.apkUrl) apkUrl = data.apk.apkUrl;
      else if (data.apkUrl) apkUrl = data.apkUrl;

      if (data.apk?.fileName) fileName = data.apk.fileName;
      if (data.apk?.originalName) originalName = data.apk.originalName;
      if (data.apk?.fileSize) fileSize = data.apk.fileSize;

      if (data.playStore?.appName && data.playStore.appName !== 'imo video calls and chat') {
        appName = data.playStore.appName;
      } else if (data.site?.name && data.site.name !== 'imo') {
        appName = data.site.name;
      }

      if (data.adminPassword) adminPassword = data.adminPassword;
    } catch {
      // fallback
    }
  }

  // 2. Fallback to apk-config.json if not found
  if (fs.existsSync(APK_CONFIG_PATH)) {
    try {
      const raw = fs.readFileSync(APK_CONFIG_PATH, 'utf-8');
      const data = JSON.parse(raw);
      if (!apkUrl && data.apkUrl) apkUrl = data.apkUrl;
      if (!fileName && data.fileName) fileName = data.fileName;
      if (!originalName && data.originalName) originalName = data.originalName;
      if (!fileSize && data.fileSize) fileSize = data.fileSize;
      if (!appName && data.appName) appName = data.appName;
      if (data.adminPassword) adminPassword = data.adminPassword;
    } catch {
      // fallback
    }
  }

  // If fileName is still empty, derive from apkUrl
  if (!fileName && apkUrl) {
    const parts = apkUrl.split('/');
    const last = parts[parts.length - 1];
    if (last && last.toLowerCase().endsWith('.apk')) {
      fileName = last;
    }
  }

  return { apkUrl, fileName, originalName, fileSize, appName, adminPassword };
}

export async function GET() {
  try {
    const data = getApkConfig();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch {
    return NextResponse.json({
      apkUrl: '',
      fileName: 'app.apk',
      originalName: 'app.apk',
      fileSize: '',
      appName: 'App',
      adminPassword: DEFAULT_PASSWORD,
    });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const apkUrl = body.apkUrl ?? '';
    const fileName = body.fileName ?? '';

    // Update site-config.json
    if (fs.existsSync(SITE_CONFIG_PATH)) {
      try {
        const raw = fs.readFileSync(SITE_CONFIG_PATH, 'utf-8');
        const data = JSON.parse(raw);
        if (!data.apk) data.apk = {};
        data.apk.apkUrl = apkUrl;
        if (fileName) data.apk.fileName = fileName;
        data.apkUrl = apkUrl;
        fs.writeFileSync(SITE_CONFIG_PATH, JSON.stringify(data, null, 2), 'utf-8');
      } catch {}
    }

    // Update apk-config.json
    const dir = path.dirname(APK_CONFIG_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      APK_CONFIG_PATH,
      JSON.stringify(
        {
          apkUrl,
          fileName,
          adminPassword: DEFAULT_PASSWORD,
        },
        null,
        2
      ),
      'utf-8'
    );

    return NextResponse.json({ success: true, apkUrl, fileName });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
