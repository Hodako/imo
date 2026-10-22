import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { filename } = await params;
    const requestedName = decodeURIComponent(filename || '');
    const apkDir = path.join(process.cwd(), 'public', 'apk');

    if (!fs.existsSync(apkDir)) {
      fs.mkdirSync(apkDir, { recursive: true });
    }

    let targetPath = path.join(apkDir, requestedName);
    let resolvedFilename = requestedName;

    // If requested file does not exist directly, look for any .apk in public/apk
    if (!fs.existsSync(targetPath)) {
      const files = fs.readdirSync(apkDir).filter((f) => f.toLowerCase().endsWith('.apk'));
      if (files.length > 0) {
        // Match either newest or configured apk
        targetPath = path.join(apkDir, files[0]);
        resolvedFilename = files[0];
      }
    }

    if (!fs.existsSync(targetPath)) {
      return new Response('APK file not found. Please upload an APK from the Admin Panel.', {
        status: 404,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    const stat = fs.statSync(targetPath);
    const fileBuffer = fs.readFileSync(targetPath);

    // Read site-config to get preferred custom/original APK download name
    let downloadName = resolvedFilename;
    const configPath = path.join(process.cwd(), 'data', 'site-config.json');
    if (fs.existsSync(configPath)) {
      try {
        const raw = fs.readFileSync(configPath, 'utf-8');
        const cfg = JSON.parse(raw);
        if (cfg.apk?.fileName) {
          downloadName = cfg.apk.fileName;
        } else if (cfg.apk?.originalName) {
          downloadName = cfg.apk.originalName;
        } else if (cfg.playStore?.appName && cfg.playStore.appName !== 'imo video calls and chat') {
          downloadName = `${cfg.playStore.appName.replace(/[^a-zA-Z0-9._\-]/g, '_')}.apk`;
        } else if (cfg.site?.name && cfg.site.name !== 'imo') {
          downloadName = `${cfg.site.name.replace(/[^a-zA-Z0-9._\-]/g, '_')}.apk`;
        }
      } catch {}
    }

    if (!downloadName.toLowerCase().endsWith('.apk')) {
      downloadName += '.apk';
    }

    const cleanAsciiName = downloadName.replace(/[^a-zA-Z0-9._\-]/g, '_');

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.android.package-archive',
        'Content-Disposition': `attachment; filename="${cleanAsciiName}"; filename*=UTF-8''${encodeURIComponent(downloadName)}`,
        'Content-Length': stat.size.toString(),
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (err) {
    return new Response(`Download error: ${err.message}`, { status: 500 });
  }
}
