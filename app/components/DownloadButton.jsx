'use client';
import { useCallback } from 'react';

export default function DownloadButton({ className, children, style }) {
  const handleDownload = useCallback(async () => {
    try {
      const res = await fetch('/api/apk-config');
      const data = await res.json();
      if (data.apkUrl && data.apkUrl.trim() !== '') {
        const link = document.createElement('a');
        link.href = data.apkUrl;
        link.download = 'imo.apk';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        showToast('Download not configured yet. Please contact admin.');
      }
    } catch {
      showToast('Failed to fetch download info. Please try again.');
    }
  }, []);

  return (
    <div className={className} style={style} onClick={handleDownload} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleDownload()}
      title="Download imo APK"
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
  }, 3000);
}
