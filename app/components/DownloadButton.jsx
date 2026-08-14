'use client';
import { useCallback, useState } from 'react';

export default function DownloadButton({ className, children, style, filename = 'imo.apk' }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();

    try {
      setDownloading(true);
      const res = await fetch('/api/apk-config');
      const data = await res.json();

      const apkUrl = data.apkUrl || '';

      if (apkUrl && apkUrl.trim() !== '') {
        // Trigger download
        const fullUrl = apkUrl.startsWith('http://') || apkUrl.startsWith('https://')
          ? apkUrl
          : `${window.location.origin}${apkUrl.startsWith('/') ? '' : '/'}${apkUrl}`;

        const link = document.createElement('a');
        link.href = fullUrl;
        link.setAttribute('download', filename);
        link.setAttribute('target', '_self');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Fallback for some mobile WebViews
        setTimeout(() => {
          if (!document.hidden) {
            window.location.href = fullUrl;
          }
        }, 500);
      } else {
        showToast('⚠️ APK download not configured yet. Set APK URL in Admin Panel.');
      }
    } catch {
      showToast('⚠️ Failed to fetch download info. Please try again.');
    } finally {
      setTimeout(() => setDownloading(false), 1000);
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
    background: 'rgba(30,30,30,0.95)',
    color: '#fff',
    padding: '14px 28px',
    borderRadius: '10px',
    fontSize: '15px',
    zIndex: '99999',
    boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
    transition: 'opacity 0.3s',
    fontFamily: 'sans-serif',
  });
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}
