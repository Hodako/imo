import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import os from 'os';

export const config = {
  api: {
    bodyParser: false,
  },
};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const form = new formidable.IncomingForm({
    multiples: false,
    uploadDir: os.tmpdir(),
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        console.error('form parse error', err);
        return res.status(500).json({ success: false, error: 'Upload parse failed' });
      }

      const file = files?.image || files?.file || null;
      if (!file) return res.status(400).json({ success: false, error: 'No image uploaded (field name: image)' });

      const tmpPath = file.filepath || file.path || file.tempFilePath || '';
      const originalName = (file.originalFilename || file.name || 'image').toString();

      // basic filetype guard (allow common image extensions)
      const lower = originalName.toLowerCase();
      if (!(/\.(jpg|jpeg|png|gif|webp|svg)$/i).test(lower)) {
        try { fs.unlinkSync(tmpPath); } catch {}
        // still allow if you prefer to accept any files; adjust as needed
        return res.status(400).json({ success: false, error: 'Unsupported image format' });
      }

      const uploadDir = path.join(process.cwd(), 'public', 'imo_files');
      ensureDir(uploadDir);

      const safeName = originalName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      const finalName = `${Date.now()}-${safeName}`;
      const finalPath = path.join(uploadDir, finalName);

      fs.renameSync(tmpPath, finalPath);

      const stat = fs.statSync(finalPath);
      if (!stat || stat.size === 0) {
        try { fs.unlinkSync(finalPath); } catch {}
        return res.status(500).json({ success: false, error: 'Written file appears empty' });
      }

      const publicUrl = `/imo_files/${finalName}`;
      return res.status(200).json({ success: true, imageUrl: publicUrl, fileName: finalName });
    } catch (e) {
      console.error('upload-image error', e);
      return res.status(500).json({ success: false, error: (e && e.message) || 'Upload failed' });
    }
  });
}
