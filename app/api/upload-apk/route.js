import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('apk');

    if (!file || file.name === 'undefined') {
      return NextResponse.json({ success: false, error: 'No APK file provided' }, { status: 400 });
    }

    const rawName = file.name || 'app.apk';

    // Validate it's an APK
    if (!rawName.toLowerCase().endsWith('.apk')) {
      return NextResponse.json({ success: false, error: 'File must end with .apk' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (!buffer || buffer.length === 0) {
      return NextResponse.json({ success: false, error: 'Uploaded file is empty (0 bytes)' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'apk');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    } else {
      // Auto-remove older .apk files to keep storage clean
      try {
        const oldFiles = fs.readdirSync(uploadDir);
        for (const oldFile of oldFiles) {
          if (oldFile.toLowerCase().endsWith('.apk')) {
            try {
              fs.unlinkSync(path.join(uploadDir, oldFile));
            } catch {
              // ignore
            }
          }
        }
      } catch {
        // ignore
      }
    }

    // Preserve original filename safely
    const ext = path.extname(rawName).toLowerCase() || '.apk';
    const baseClean = path.basename(rawName, ext).replace(/[^a-zA-Z0-9._\-]/g, '_').trim() || 'app';
    const filename = `${baseClean}.apk`;
    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/apk/${filename}`;
    const sizeInMB = (buffer.length / (1024 * 1024)).toFixed(1) + ' MB';

    // Auto update site-config.json and apk-config.json on disk immediately
    const SITE_CONFIG_PATH = path.join(process.cwd(), 'data', 'site-config.json');
    const APK_CONFIG_PATH = path.join(process.cwd(), 'data', 'apk-config.json');

    let activeAppName = baseClean.replace(/[_\-]/g, ' ');

    if (fs.existsSync(SITE_CONFIG_PATH)) {
      try {
        const raw = fs.readFileSync(SITE_CONFIG_PATH, 'utf-8');
        const data = JSON.parse(raw);
        if (!data.apk) data.apk = {};
        data.apk.apkUrl = publicUrl;
        data.apk.fileName = filename;
        data.apk.originalName = rawName;
        data.apk.fileSize = sizeInMB;
        data.apk.uploadedAt = new Date().toISOString();
        data.apkUrl = publicUrl;

        if (data.site?.name && data.site.name !== 'imo') {
          activeAppName = data.site.name;
        }

        // Auto-sync Play Store app name if still default imo
        if (data.playStore) {
          if (!data.playStore.appName || data.playStore.appName === 'imo video calls and chat') {
            data.playStore.appName = activeAppName;
          }
        }

        fs.writeFileSync(SITE_CONFIG_PATH, JSON.stringify(data, null, 2), 'utf-8');
      } catch {}
    }

    try {
      let adminPassword = 'admin123';
      if (fs.existsSync(APK_CONFIG_PATH)) {
        try {
          const raw = fs.readFileSync(APK_CONFIG_PATH, 'utf-8');
          const data = JSON.parse(raw);
          if (data.adminPassword) adminPassword = data.adminPassword;
        } catch {}
      }
      fs.writeFileSync(
        APK_CONFIG_PATH,
        JSON.stringify(
          {
            apkUrl: publicUrl,
            fileName: filename,
            originalName: rawName,
            fileSize: sizeInMB,
            appName: activeAppName,
            adminPassword,
          },
          null,
          2
        ),
        'utf-8'
      );
    } catch {}

    return NextResponse.json({
      success: true,
      apkUrl: publicUrl,
      fileName: filename,
      originalName: rawName,
      fileSize: sizeInMB,
      appName: activeAppName,
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
