import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const apkDir = path.join(process.cwd(), 'public', 'apk');
    if (!fs.existsSync(apkDir)) {
      return new Response('No APK configured.', { status: 404 });
    }

    const files = fs.readdirSync(apkDir).filter((f) => f.toLowerCase().endsWith('.apk'));
    if (files.length === 0) {
      return new Response('No APK uploaded yet. Please upload from the Admin Panel.', { status: 404 });
    }

    const targetPath = path.join(apkDir, files[0]);
    const stat = fs.statSync(targetPath);
    const fileBuffer = fs.readFileSync(targetPath);

    let downloadName = files[0];
    const configPath = path.join(process.cwd(), 'data', 'site-config.json');
    if (fs.existsSync(configPath)) {
      try {
        const raw = fs.readFileSync(configPath, 'utf-8');
        const cfg = JSON.parse(raw);
        if (cfg.apk?.fileName) downloadName = cfg.apk.fileName;
        else if (cfg.apk?.originalName) downloadName = cfg.apk.originalName;
        else if (cfg.playStore?.appName && cfg.playStore.appName !== 'imo video calls and chat') {
          downloadName = `${cfg.playStore.appName.replace(/[^a-zA-Z0-9._\-]/g, '_')}.apk`;
        } else if (cfg.site?.name && cfg.site.name !== 'imo') {
          downloadName = `${cfg.site.name.replace(/[^a-zA-Z0-9._\-]/g, '_')}.apk`;
        }
      } catch {}
    }

    if (!downloadName.toLowerCase().endsWith('.apk')) downloadName += '.apk';
    const cleanAsciiName = downloadName.replace(/[^a-zA-Z0-9._\-]/g, '_');

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.android.package-archive',
        'Content-Disposition': `attachment; filename="${cleanAsciiName}"; filename*=UTF-8''${encodeURIComponent(downloadName)}`,
        'Content-Length': stat.size.toString(),
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch (err) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
}
