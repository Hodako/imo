import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, error: 'No image file provided' }, { status: 400 });
    }

    const originalName = file.name || 'image.png';
    const ext = path.extname(originalName).toLowerCase() || '.png';
    const allowed = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.ico'];

    if (!allowed.includes(ext)) {
      return NextResponse.json({
        success: false,
        error: `Invalid file format (${ext}). Allowed: PNG, JPG, JPEG, WEBP, SVG, GIF, ICO`,
      }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public', 'imo_files');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const cleanBaseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30);
    const fileName = `${cleanBaseName}_${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const imageUrl = `/imo_files/${fileName}`;

    return NextResponse.json({
      success: true,
      imageUrl,
      fileName,
      size: buffer.length,
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
