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

      const file = files?.apk || files?.file || null;
      if (!file) return res.status(400).json({ success: false, error: 'No apk uploaded (field name: apk)' });

      const tmpPath = file.filepath || file.path || file.tempFilePath || '';
      const originalName = (file.originalFilename || file.name || 'imo.apk').toString();
      if (!originalName.toLowerCase().endsWith('.apk')) {
        // clean temp
        try { fs.unlinkSync(tmpPath); } catch {}
        return res.status(400).json({ success: false, error: 'Uploaded file is not .apk' });
      }

      const uploadDir = path.join(process.cwd(), 'public', 'apk');
      ensureDir(uploadDir);

      const safeName = originalName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      const finalName = `${Date.now()}-${safeName}`;
      const finalPath = path.join(uploadDir, finalName);

      // Move temp -> final (atomic rename on same filesystem)
      fs.renameSync(tmpPath, finalPath);

      // Verify file size > 0
      const stat = fs.statSync(finalPath);
      if (!stat || stat.size === 0) {
        // remove zero byte and error
        try { fs.unlinkSync(finalPath); } catch {}
        return res.status(500).json({ success: false, error: 'Written file appears empty' });
      }

      // Remove other old APKs (keep only this one)
      try {
        const filesInDir = fs.readdirSync(uploadDir);
        for (const f of filesInDir) {
          if (f === finalName) continue;
          const p = path.join(uploadDir, f);
          try { fs.unlinkSync(p); } catch (e) { /* ignore individual delete errors */ }
        }
      } catch (e) {
        // ignore
      }

      const publicUrl = `/apk/${finalName}`; // Admin UI expects /apk/filename
      return res.status(200).json({ success: true, apkUrl: publicUrl, fileName: finalName });
    } catch (e) {
      console.error('upload-apk error', e);
      return res.status(500).json({ success: false, error: (e && e.message) || 'Upload failed' });
    }
  });
}
