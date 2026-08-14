'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './admin.module.css';
import { logoutAdmin, saveApkUrlAction, changePasswordAction } from './actions';

export default function AdminDashboard({ initialConfig = {}, isQueryAuth = false }) {
  // APK config state
  const [currentUrl, setCurrentUrl] = useState(initialConfig.apkUrl || '');
  const [urlInput, setUrlInput] = useState(initialConfig.apkUrl || '');
  const [status, setStatus] = useState(null); // { type: 'success'|'error', msg }
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwChangeStatus, setPwChangeStatus] = useState(null);
  const [changingPw, setChangingPw] = useState(false);

  useEffect(() => {
    // Ensure cookie is set on client for persistent sessions across tabs/reloads
    document.cookie = `imo_admin_session=true; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
  }, []);

  async function handleLogout() {
    try {
      await logoutAdmin();
    } catch {
      // ignore
    }
    // Delete cookie on client too
    document.cookie = 'imo_admin_session=; path=/; max-age=0; SameSite=Lax';
    window.location.reload();
  }

  async function handleSaveUrl(e) {
    if (e && e.preventDefault) e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const res = await saveApkUrlAction(urlInput.trim());
      if (res.success) {
        setCurrentUrl(urlInput.trim());
        setStatus({ type: 'success', msg: '✅ APK download URL saved successfully!' });
      } else {
        setStatus({ type: 'error', msg: `❌ Error: ${res.error}` });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: `❌ Network error: ${err.message}` });
    } finally {
      setSaving(false);
    }
  }

  async function handleClear() {
    if (!confirm('Are you sure you want to clear the APK URL?')) return;
    setSaving(true);
    setStatus(null);
    try {
      const res = await saveApkUrlAction('');
      if (res.success) {
        setCurrentUrl('');
        setUrlInput('');
        setStatus({ type: 'success', msg: '🗑️ APK URL removed. Download disabled.' });
      } else {
        setStatus({ type: 'error', msg: `❌ Error: ${res.error}` });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: `❌ Error: ${err.message}` });
    } finally {
      setSaving(false);
    }
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.apk')) {
      setStatus({ type: 'error', msg: '❌ Please select an .apk file (file must end with .apk).' });
      return;
    }

    setUploading(true);
    setUploadProgress(`Uploading ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)...`);
    setStatus(null);

    const formData = new FormData();
    formData.append('apk', file);

    try {
      const uploadRes = await fetch('/api/upload-apk', {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadData.success) {
        setStatus({ type: 'error', msg: `❌ Upload failed: ${uploadData.error}` });
        return;
      }

      // Auto-save the uploaded URL
      const saveRes = await saveApkUrlAction(uploadData.apkUrl);
      if (saveRes.success) {
        setCurrentUrl(uploadData.apkUrl);
        setUrlInput(uploadData.apkUrl);
        setStatus({ type: 'success', msg: `✅ APK uploaded & saved! Active URL: ${uploadData.apkUrl}` });
      } else {
        setStatus({ type: 'error', msg: `❌ Uploaded but save failed: ${saveRes.error}` });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: `❌ Upload error: ${err.message}` });
    } finally {
      setUploading(false);
      setUploadProgress('');
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  function handleCopy() {
    if (!currentUrl) return;
    try {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = currentUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleTestDownload() {
    if (!currentUrl) {
      alert('No APK URL configured yet.');
      return;
    }
    const link = document.createElement('a');
    link.href = currentUrl;
    link.download = 'imo.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function handleChangePassword(e) {
    if (e && e.preventDefault) e.preventDefault();
    setPwChangeStatus(null);

    if (!currentPassword) {
      setPwChangeStatus({ type: 'error', msg: 'Please enter your current password.' });
      return;
    }
    if (!newPassword) {
      setPwChangeStatus({ type: 'error', msg: 'Please enter a new password.' });
      return;
    }
    if (newPassword.length < 4) {
      setPwChangeStatus({ type: 'error', msg: 'New password must be at least 4 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwChangeStatus({ type: 'error', msg: 'New passwords do not match. Please re-type.' });
      return;
    }

    setChangingPw(true);

    try {
      const res = await changePasswordAction(currentPassword, newPassword);

      if (res.success) {
        setPwChangeStatus({ type: 'success', msg: '✅ Password changed successfully! Keep your new password safe.' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPwChangeStatus({ type: 'error', msg: `❌ ${res.error || 'Failed to update password.'}` });
      }
    } catch (err) {
      setPwChangeStatus({ type: 'error', msg: `❌ Network error: ${err.message}` });
    } finally {
      setChangingPw(false);
    }
  }

  return (
    <div className={styles.wrap}>
      {/* SIDEBAR / TOPBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <img src="/imo_files/imo.30ad61b6.png" alt="imo" className={styles.sideLogoImg} />
          <div className={styles.sideBrand}>
            <span className={styles.brandTitle}>imo</span>
            <span className={styles.brandBadge}>Admin</span>
          </div>
        </div>
        <nav className={styles.sideNav}>
          <a href="/" className={styles.sideNavLink} target="_blank" rel="noopener noreferrer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span>View Site</span>
          </a>
          <a href="#apk-manager" className={`${styles.sideNavLink} ${styles.active}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>APK Manager</span>
          </a>
          <a href="#change-password" className={styles.sideNavLink}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span>Password</span>
          </a>
        </nav>
        <button className={styles.logoutBtn} onClick={handleLogout} id="admin-logout-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          <span>Logout</span>
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>APK &amp; Security Manager</h1>
          <p className={styles.pageDesc}>Configure the APK download source, upload new APK packages, or update your admin password.</p>
        </div>

        {/* STATUS BANNER */}
        {status && (
          <div className={`${styles.statusBanner} ${status.type === 'success' ? styles.statusSuccess : styles.statusError}`}>
            {status.msg}
          </div>
        )}

        {/* 1. CURRENT ACTIVE APK STATUS CARD */}
        <div className={styles.card} id="apk-manager">
          <div className={styles.cardHeader}>
            <div className={styles.cardTitleWrap}>
              <h2 className={styles.cardTitle}>Current Active APK</h2>
              {currentUrl ? (
                <span className={styles.activeBadge}>● Active &amp; Ready</span>
              ) : (
                <span className={styles.inactiveBadge}>○ Not Configured</span>
              )}
            </div>
            <p className={styles.cardDesc}>This is the file delivered when visitors tap "Download Now" on phone or PC.</p>
          </div>

          <div className={styles.currentUrlBox}>
            {currentUrl ? (
              <div className={styles.urlDisplayRow}>
                <div className={styles.urlChip}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  <span className={styles.urlText}>{currentUrl}</span>
                </div>
                <div className={styles.quickActions}>
                  <button className={styles.btnSmall} onClick={handleCopy} title="Copy URL">
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                  <button className={styles.btnSmallPrimary} onClick={handleTestDownload} title="Test Download">
                    Test Download
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.emptyWarning}>
                <p>⚠️ No APK is currently configured. Clicking download on the site will show a "not configured" notice.</p>
              </div>
            )}
          </div>
        </div>

        {/* 2. SET APK URL CARD */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Set External or Hosted APK URL</h2>
            <p className={styles.cardDesc}>Paste a direct download URL (e.g. <code>https://example.com/imo.apk</code>) or an internal path.</p>
          </div>
          <form onSubmit={handleSaveUrl} className={styles.form}>
            <div className={styles.inputGroup}>
              <input
                id="apk-url-input"
                type="text"
                className={styles.input}
                placeholder="https://example.com/imo.apk  or  /apk/imo.apk"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                autoCapitalize="none"
                autoCorrect="off"
              />
            </div>
            <div className={styles.btnRow}>
              <button type="submit" className={styles.btnPrimary} disabled={saving} id="save-url-btn">
                {saving ? 'Saving…' : 'Save URL'}
              </button>
              <button type="button" className={styles.btnDanger} onClick={handleClear} disabled={saving} id="clear-url-btn">
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* 3. UPLOAD DIRECT APK CARD */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Upload APK Package</h2>
            <p className={styles.cardDesc}>Upload an Android .apk package directly from your smart phone or PC. It will be stored on the server and auto-activated.</p>
          </div>
          <div className={styles.uploadZone} onClick={() => fileRef.current?.click()} id="upload-zone">
            <input
              ref={fileRef}
              type="file"
              accept=".apk,application/vnd.android.package-archive,application/octet-stream,*/*"
              style={{ display: 'none' }}
              onChange={handleUpload}
              id="apk-file-input"
            />
            {uploading ? (
              <div className={styles.uploadingState}>
                <div className={styles.spinner}></div>
                <span>{uploadProgress || 'Uploading & saving APK package…'}</span>
              </div>
            ) : (
              <>
                <div className={styles.uploadIconWrap}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.uploadIcon}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <p className={styles.uploadLabel}>Tap or Click to Select <strong>.apk</strong> File</p>
                <p className={styles.uploadHint}>Uploaded files are saved to <code>/public/apk/</code></p>
                <button
                  type="button"
                  className={styles.btnUploadTrigger}
                  onClick={(e) => {
                    e.stopPropagation();
                    fileRef.current?.click();
                  }}
                >
                  Choose File from Device
                </button>
              </>
            )}
          </div>
        </div>

        {/* 4. CHANGE PASSWORD CARD */}
        <div className={styles.card} id="change-password">
          <div className={styles.cardHeader}>
            <div className={styles.cardTitleWrap}>
              <h2 className={styles.cardTitle}>Change Admin Password</h2>
              <span className={styles.securityBadge}>🔒 Security</span>
            </div>
            <p className={styles.cardDesc}>Update your administrator password. Current default password: <code>admin123</code></p>
          </div>

          {pwChangeStatus && (
            <div className={`${styles.statusBanner} ${pwChangeStatus.type === 'success' ? styles.statusSuccess : styles.statusError}`} style={{ marginBottom: '16px' }}>
              {pwChangeStatus.msg}
            </div>
          )}

          <form onSubmit={handleChangePassword} className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.formLabel}>Current Password</label>
              <input
                type={showNewPw ? 'text' : 'password'}
                className={styles.input}
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="current-password"
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.formLabel}>New Password</label>
              <div className={styles.inputWrapper}>
                <input
                  type={showNewPw ? 'text' : 'password'}
                  className={styles.input}
                  placeholder="Enter new password (min. 4 chars)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoCapitalize="none"
                  autoCorrect="off"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className={styles.showPwBtn}
                  onClick={() => setShowNewPw(!showNewPw)}
                  aria-label="Toggle password visibility"
                >
                  {showNewPw ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.formLabel}>Confirm New Password</label>
              <input
                type={showNewPw ? 'text' : 'password'}
                className={styles.input}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="new-password"
              />
            </div>

            <div className={styles.btnRow}>
              <button
                type="submit"
                className={styles.btnPrimary}
                disabled={changingPw}
                id="update-password-btn"
              >
                {changingPw ? 'Updating Password…' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>

      </main>
    </div>
  );
}
