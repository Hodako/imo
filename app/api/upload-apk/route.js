import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('apk');

    if (!file || file.name === 'undefined') {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // Validate it's an APK
    if (!file.name.toLowerCase().endsWith('.apk')) {
      return NextResponse.json({ success: false, error: 'File must be an .apk' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public', 'apk');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    } else {
      // Auto-remove older .apk files to keep storage clean and remove outdated packages
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

    const filename = `imo-${Date.now()}.apk`;
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/apk/${filename}`;
    return NextResponse.json({ success: true, apkUrl: publicUrl });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
