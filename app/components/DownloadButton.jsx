'use client';
import { useCallback, useState } from 'react';

export default function DownloadButton({ className, children, style, filename }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();

    try {
      setDownloading(true);
      const res = await fetch(`/api/apk-config?_t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();

      const apkUrl = data.apkUrl || '';

      if (apkUrl && apkUrl.trim() !== '') {
        // Determine the real download filename
        let downloadName = filename;
        if (!downloadName) {
          if (data.fileName) downloadName = data.fileName;
          else if (data.originalName) downloadName = data.originalName;
          else if (data.appName && data.appName !== 'imo video calls and chat') {
            downloadName = `${data.appName.replace(/[^a-zA-Z0-9._\-]/g, '_')}.apk`;
          } else {
            const parts = apkUrl.split('/');
            const last = parts[parts.length - 1];
            downloadName = (last && last.toLowerCase().endsWith('.apk')) ? last : 'app.apk';
          }
        }

        if (!downloadName.toLowerCase().endsWith('.apk')) {
          downloadName += '.apk';
        }

        // Construct reliable full download URL
        const fullUrl = apkUrl.startsWith('http://') || apkUrl.startsWith('https://')
          ? apkUrl
          : `${window.location.origin}${apkUrl.startsWith('/') ? '' : '/'}${apkUrl}`;

        // Create link and trigger download
        const link = document.createElement('a');
        link.href = fullUrl;
        link.download = downloadName;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
          if (document.body.contains(link)) {
            document.body.removeChild(link);
          }
        }, 300);

        showToast(`📥 Starting download: ${downloadName}`);
      } else {
        showToast('⚠️ APK download not configured yet. Set APK URL in Admin Panel.');
      }
    } catch {
      showToast('⚠️ Failed to fetch download info. Please try again.');
    } finally {
      setTimeout(() => setDownloading(false), 1200);
    }
  }, [filename]);

  return (
    <div
      className={className}
      style={style}
      onClick={handleDownload}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleDownload(e)}
      title="Download APK"
    >
      {children}
    </div>
  );
}

function showToast(msg) {
  if (typeof document === 'undefined') return;
  const existing = document.getElementById('imo-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'imo-toast';
  toast.textContent = msg;
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '32px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(20, 24, 33, 0.96)',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '500',
    zIndex: '99999',
    boxShadow: '0 8px 30px rgba(0,0,0,0.35)',
    border: '1px solid rgba(255,255,255,0.15)',
    transition: 'opacity 0.3s ease',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  });
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}
