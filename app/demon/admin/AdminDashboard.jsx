'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './admin.module.css';
import { logoutAdmin, saveSiteConfigAction, saveApkUrlAction, changePasswordAction } from './actions';

const DEFAULT_THEME_COLORS = {
  primary: '#009dff',
  primaryHover: '#0088de',
  primaryGradient: '#00c2ff',
  heroTitleColor: '#009dff',
  heroDescColor: '#009dff',
  bodyTextColor: '#222222',
  sec1Bg: '#0093ff',
  sec1Text: '#ffffff',
  sec2Bg: '#131b21',
  sec2Text: '#009dff',
  sec3Bg: '#c8ebff',
  sec3Text: '#009dff',
  sec4Bg: '#009dff',
  sec4Text: '#ffffff',
  sec5Bg: '#c8ebff',
  sec5Text: '#009dff',
  footerBg: '#131b21',
  footerText: '#ffffff',
};

const THEME_PRESETS = [
  {
    name: '🔵 imo Classic Blue',
    colors: {
      primary: '#009dff',
      primaryHover: '#0088de',
      heroTitleColor: '#009dff',
      heroDescColor: '#009dff',
      sec1Bg: '#0093ff',
      sec1Text: '#ffffff',
      sec2Bg: '#131b21',
      sec2Text: '#009dff',
      sec3Bg: '#c8ebff',
      sec3Text: '#009dff',
      sec4Bg: '#009dff',
      sec4Text: '#ffffff',
      sec5Bg: '#c8ebff',
      sec5Text: '#009dff',
      footerBg: '#131b21',
      footerText: '#ffffff',
    },
  },
  {
    name: '🟢 Emerald Green',
    colors: {
      primary: '#25D366',
      primaryHover: '#1eb956',
      heroTitleColor: '#25D366',
      heroDescColor: '#128C7E',
      sec1Bg: '#128C7E',
      sec1Text: '#ffffff',
      sec2Bg: '#075E54',
      sec2Text: '#25D366',
      sec3Bg: '#dcf8c6',
      sec3Text: '#075E54',
      sec4Bg: '#128C7E',
      sec4Text: '#ffffff',
      sec5Bg: '#dcf8c6',
      sec5Text: '#075E54',
      footerBg: '#075E54',
      footerText: '#ffffff',
    },
  },
  {
    name: '🟣 Royal Violet',
    colors: {
      primary: '#6366f1',
      primaryHover: '#4f46e5',
      heroTitleColor: '#6366f1',
      heroDescColor: '#4f46e5',
      sec1Bg: '#4f46e5',
      sec1Text: '#ffffff',
      sec2Bg: '#1e1b4b',
      sec2Text: '#a5b4fc',
      sec3Bg: '#e0e7ff',
      sec3Text: '#4338ca',
      sec4Bg: '#4f46e5',
      sec4Text: '#ffffff',
      sec5Bg: '#e0e7ff',
      sec5Text: '#4338ca',
      footerBg: '#1e1b4b',
      footerText: '#ffffff',
    },
  },
  {
    name: '🌑 Midnight Dark',
    colors: {
      primary: '#38bdf8',
      primaryHover: '#0284c7',
      heroTitleColor: '#38bdf8',
      heroDescColor: '#94a3b8',
      sec1Bg: '#1e293b',
      sec1Text: '#f8fafc',
      sec2Bg: '#0f172a',
      sec2Text: '#38bdf8',
      sec3Bg: '#334155',
      sec3Text: '#38bdf8',
      sec4Bg: '#1e293b',
      sec4Text: '#f8fafc',
      sec5Bg: '#334155',
      sec5Text: '#38bdf8',
      footerBg: '#020617',
      footerText: '#f8fafc',
    },
  },
  {
    name: '🔴 Crimson Red',
    colors: {
      primary: '#e11d48',
      primaryHover: '#be123c',
      heroTitleColor: '#e11d48',
      heroDescColor: '#be123c',
      sec1Bg: '#be123c',
      sec1Text: '#ffffff',
      sec2Bg: '#4c0519',
      sec2Text: '#fda4af',
      sec3Bg: '#ffe4e6',
      sec3Text: '#be123c',
      sec4Bg: '#be123c',
      sec4Text: '#ffffff',
      sec5Bg: '#ffe4e6',
      sec5Text: '#be123c',
      footerBg: '#4c0519',
      footerText: '#ffffff',
    },
  },
];

export default function AdminDashboard({ initialConfig = {}, isQueryAuth = false }) {
  const [activeTab, setActiveTab] = useState('general');
  const [config, setConfig] = useState(initialConfig);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success'|'error', msg }
  const [uploadingField, setUploadingField] = useState(null);

  // APK config specific state
  const [copied, setCopied] = useState(false);
  const [apkUploading, setApkUploading] = useState(false);
  const [apkProgress, setApkProgress] = useState('');
  const apkFileRef = useRef(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwChangeStatus, setPwChangeStatus] = useState(null);
  const [changingPw, setChangingPw] = useState(false);

  useEffect(() => {
    document.cookie = `imo_admin_session=true; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
  }, []);

  // Generic config field updater
  function updateField(section, key, value) {
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [key]: value,
      },
    }));
  }

  // Nested section updater (for sections.section1, etc.)
  function updateSectionField(secKey, field, value) {
    setConfig((prev) => ({
      ...prev,
      sections: {
        ...(prev.sections || {}),
        [secKey]: {
          ...((prev.sections && prev.sections[secKey]) || {}),
          [field]: value,
        },
      },
    }));
  }

  // Colors updater
  function updateColor(key, value) {
    setConfig((prev) => ({
      ...prev,
      colors: {
        ...(prev.colors || DEFAULT_THEME_COLORS),
        [key]: value,
      },
    }));
  }

  function applyPreset(presetColors) {
    setConfig((prev) => ({
      ...prev,
      colors: {
        ...(prev.colors || DEFAULT_THEME_COLORS),
        ...presetColors,
      },
    }));
    setStatus({ type: 'success', msg: '🎨 Preset applied! Click "Save Colors" below to publish.' });
  }

  function resetColorsToDefault() {
    setConfig((prev) => ({
      ...prev,
      colors: { ...DEFAULT_THEME_COLORS },
    }));
    setStatus({ type: 'success', msg: '🔄 Colors reset to default! Click "Save Colors" to publish.' });
  }

  // Save current config
  async function handleSaveConfig(e) {
    if (e && e.preventDefault) e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const res = await saveSiteConfigAction(config);
      if (res.success) {
        setStatus({ type: 'success', msg: '✅ All changes saved successfully!' });
      } else {
        setStatus({ type: 'error', msg: `❌ Save failed: ${res.error}` });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: `❌ Network error: ${err.message}` });
    } finally {
      setSaving(false);
    }
  }

  // Image file uploader helper
  async function handleImageUpload(e, onUploaded, fieldId) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldId);
    setStatus(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.imageUrl) {
        onUploaded(data.imageUrl);
        setStatus({ type: 'success', msg: `✅ Image uploaded! (${data.fileName})` });
      } else {
        setStatus({ type: 'error', msg: `❌ Upload failed: ${data.error || 'Unknown error'}` });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: `❌ Upload error: ${err.message}` });
    } finally {
      setUploadingField(null);
      e.target.value = '';
    }
  }

  // APK file uploader
  async function handleApkUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.apk')) {
      setStatus({ type: 'error', msg: '❌ Please select an .apk file (file must end with .apk).' });
      return;
    }

    setApkUploading(true);
    setApkProgress(`Uploading ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)...`);
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

      const saveRes = await saveApkUrlAction(uploadData.apkUrl);
      if (saveRes.success) {
        updateField('apk', 'apkUrl', uploadData.apkUrl);
        setStatus({ type: 'success', msg: `✅ APK uploaded & saved! Active URL: ${uploadData.apkUrl}` });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: `❌ Upload error: ${err.message}` });
    } finally {
      setApkUploading(false);
      setApkProgress('');
      if (apkFileRef.current) apkFileRef.current.value = '';
    }
  }

  async function handleLogout() {
    try {
      await logoutAdmin();
    } catch {}
    document.cookie = 'imo_admin_session=; path=/; max-age=0; SameSite=Lax';
    window.location.reload();
  }

  function handleCopyUrl() {
    const url = config.apk?.apkUrl || config.apkUrl || '';
    if (!url) return;
    try {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleTestDownload() {
    const url = config.apk?.apkUrl || config.apkUrl || '';
    if (!url) {
      alert('No APK URL configured yet.');
      return;
    }
    const link = document.createElement('a');
    link.href = url;
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
        setPwChangeStatus({ type: 'success', msg: '✅ Password changed successfully!' });
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

  // Image upload control sub-component
  function ImageInput({ label, value, onChange, fieldId }) {
    const inputRef = useRef(null);
    const isUploading = uploadingField === fieldId;

    return (
      <div className={styles.imageControlWrap}>
        <label className={styles.formLabel}>{label}</label>
        <div className={styles.imagePreviewRow}>
          <div className={styles.imagePreviewBox}>
            {value ? (
              <img src={value} alt="Preview" className={styles.previewImg} />
            ) : (
              <span style={{ fontSize: '11px', color: '#666' }}>No Image</span>
            )}
          </div>
          <div className={styles.imageInputWithUpload}>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. /imo_files/logo.png or https://..."
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
            />
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => handleImageUpload(e, onChange, fieldId)}
            />
            <button
              type="button"
              className={styles.btnUploadSmall}
              disabled={isUploading}
              onClick={() => inputRef.current?.click()}
            >
              {isUploading ? 'Uploading…' : '📁 Upload Image'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Color picker field sub-component
  function ColorPickerField({ label, colorKey, defaultHex = '#009dff' }) {
    const currentColor = config.colors?.[colorKey] || defaultHex;
    return (
      <div className={styles.colorControlCard}>
        <label className={styles.formLabel}>{label}</label>
        <div className={styles.colorInputRow}>
          <input
            type="color"
            className={styles.colorNativePicker}
            value={currentColor.startsWith('#') ? currentColor : defaultHex}
            onChange={(e) => updateColor(colorKey, e.target.value)}
          />
          <input
            type="text"
            className={styles.input}
            value={currentColor}
            onChange={(e) => updateColor(colorKey, e.target.value)}
            placeholder="#009dff"
          />
        </div>
      </div>
    );
  }

  const currentApkUrl = config.apk?.apkUrl || config.apkUrl || '';

  return (
    <div className={styles.wrap}>
      {/* SIDEBAR / TOPBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <img src={config.site?.logoUrl || '/imo_files/imo.30ad61b6.png'} alt="imo" className={styles.sideLogoImg} />
          <div className={styles.sideBrand}>
            <span className={styles.brandTitle}>{config.site?.name || 'imo'}</span>
            <span className={styles.brandBadge}>Admin CMS</span>
          </div>
        </div>

        <nav className={styles.sideNav}>
          <a href="/" className={styles.sideNavLink} target="_blank" rel="noopener noreferrer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span>View Live Site ↗</span>
          </a>
          <button className={`${styles.sideNavLink} ${activeTab === 'general' ? styles.active : ''}`} onClick={() => setActiveTab('general')}>
            🌐 General &amp; Branding
          </button>
          <button className={`${styles.sideNavLink} ${activeTab === 'hero' ? styles.active : ''}`} onClick={() => setActiveTab('hero')}>
            🚀 Hero Section
          </button>
          <button className={`${styles.sideNavLink} ${activeTab === 'sections' ? styles.active : ''}`} onClick={() => setActiveTab('sections')}>
            📱 Feature Sections
          </button>
          <button className={`${styles.sideNavLink} ${activeTab === 'colors' ? styles.active : ''}`} onClick={() => setActiveTab('colors')}>
            🎨 Theme &amp; Colors
          </button>
          <button className={`${styles.sideNavLink} ${activeTab === 'links' ? styles.active : ''}`} onClick={() => setActiveTab('links')}>
            🔗 Links &amp; Redirects
          </button>
          <button className={`${styles.sideNavLink} ${activeTab === 'apk' ? styles.active : ''}`} onClick={() => setActiveTab('apk')}>
            📦 APK Manager
          </button>
          <button className={`${styles.sideNavLink} ${activeTab === 'security' ? styles.active : ''}`} onClick={() => setActiveTab('security')}>
            🔒 Security
          </button>
        </nav>

        <button className={styles.logoutBtn} onClick={handleLogout} id="admin-logout-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          <span>Logout</span>
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Site Customizer &amp; Admin Panel</h1>
          <p className={styles.pageDesc}>Edit any text, customize colors, upload images, manage redirects, update APK downloads, or change passwords in real-time.</p>
        </div>

        {/* TABS HEADER FOR MOBILE / QUICK SWITCH */}
        <div className={styles.tabsNav}>
          <button className={`${styles.tabBtn} ${activeTab === 'general' ? styles.tabBtnActive : ''}`} onClick={() => setActiveTab('general')}>
            🌐 Branding
          </button>
          <button className={`${styles.tabBtn} ${activeTab === 'hero' ? styles.tabBtnActive : ''}`} onClick={() => setActiveTab('hero')}>
            🚀 Hero
          </button>
          <button className={`${styles.tabBtn} ${activeTab === 'sections' ? styles.tabBtnActive : ''}`} onClick={() => setActiveTab('sections')}>
            📱 Features
          </button>
          <button className={`${styles.tabBtn} ${activeTab === 'colors' ? styles.tabBtnActive : ''}`} onClick={() => setActiveTab('colors')}>
            🎨 Colors
          </button>
          <button className={`${styles.tabBtn} ${activeTab === 'links' ? styles.tabBtnActive : ''}`} onClick={() => setActiveTab('links')}>
            🔗 Redirects
          </button>
          <button className={`${styles.tabBtn} ${activeTab === 'apk' ? styles.tabBtnActive : ''}`} onClick={() => setActiveTab('apk')}>
            📦 APK
          </button>
          <button className={`${styles.tabBtn} ${activeTab === 'security' ? styles.tabBtnActive : ''}`} onClick={() => setActiveTab('security')}>
            🔒 Password
          </button>
        </div>

        {/* STATUS BANNER */}
        {status && (
          <div className={`${styles.statusBanner} ${status.type === 'success' ? styles.statusSuccess : styles.statusError}`}>
            {status.msg}
          </div>
        )}

        {/* ==================== TAB 1: GENERAL & BRANDING ==================== */}
        {activeTab === 'general' && (
          <form onSubmit={handleSaveConfig} className={styles.form}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Global Site Branding &amp; Metadata</h2>
                <p className={styles.cardDesc}>Configure website identity, name, metadata, and logo.</p>
              </div>

              <div className={styles.formGrid2}>
                <div className={styles.inputGroup}>
                  <label className={styles.formLabel}>Site Name</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={config.site?.name || ''}
                    onChange={(e) => updateField('site', 'name', e.target.value)}
                    placeholder="e.g. imo"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.formLabel}>Browser Title (Page Title)</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={config.site?.title || ''}
                    onChange={(e) => updateField('site', 'title', e.target.value)}
                    placeholder="e.g. imo - Free Video Calls and Chat"
                  />
                </div>
              </div>

              <div className={styles.inputGroup} style={{ marginTop: '16px' }}>
                <label className={styles.formLabel}>Meta Description (SEO &amp; Social Shares)</label>
                <textarea
                  className={styles.textareaInput}
                  value={config.site?.description || ''}
                  onChange={(e) => updateField('site', 'description', e.target.value)}
                  placeholder="Website description..."
                />
              </div>

              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <ImageInput
                  label="Website Logo"
                  value={config.site?.logoUrl || ''}
                  onChange={(val) => updateField('site', 'logoUrl', val)}
                  fieldId="siteLogo"
                />

                <ImageInput
                  label="Favicon / Icon"
                  value={config.site?.faviconUrl || ''}
                  onChange={(val) => updateField('site', 'faviconUrl', val)}
                  fieldId="siteFavicon"
                />
              </div>

              <div className={styles.btnRow} style={{ marginTop: '20px' }}>
                <button type="submit" className={styles.btnPrimary} disabled={saving}>
                  {saving ? 'Saving…' : '💾 Save General Settings'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ==================== TAB 2: HERO SECTION ==================== */}
        {activeTab === 'hero' && (
          <form onSubmit={handleSaveConfig} className={styles.form}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Hero Section Content &amp; Imagery</h2>
                <p className={styles.cardDesc}>Customize main headline, subtitle, buttons, and hero collage artwork.</p>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.formLabel}>Hero Headline (Use new lines for line breaks)</label>
                <textarea
                  className={styles.textareaInput}
                  value={config.hero?.title || ''}
                  onChange={(e) => updateField('hero', 'title', e.target.value)}
                  placeholder="Free, Simple,\nand Secure"
                  style={{ minHeight: '70px' }}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.formLabel}>Hero Subtitle</label>
                <input
                  type="text"
                  className={styles.input}
                  value={config.hero?.subtitle || ''}
                  onChange={(e) => updateField('hero', 'subtitle', e.target.value)}
                  placeholder="Connect with your loved ones through calls and messages."
                />
              </div>

              <div className={styles.formGrid2} style={{ marginTop: '14px' }}>
                <div className={styles.inputGroup}>
                  <label className={styles.formLabel}>Download Button Label</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={config.hero?.downloadBtnText || ''}
                    onChange={(e) => updateField('hero', 'downloadBtnText', e.target.value)}
                    placeholder="Download Now"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.formLabel}>More Versions Text</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={config.hero?.moreVersionsText || ''}
                    onChange={(e) => updateField('hero', 'moreVersionsText', e.target.value)}
                    placeholder="More Versions >"
                  />
                </div>
              </div>

              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <ImageInput
                  label="Hero Collage Artwork Image"
                  value={config.hero?.artworkImage || ''}
                  onChange={(val) => updateField('hero', 'artworkImage', val)}
                  fieldId="heroArtwork"
                />

                <ImageInput
                  label="Hero Background Top Artwork (Optional)"
                  value={config.hero?.bgImage || ''}
                  onChange={(val) => updateField('hero', 'bgImage', val)}
                  fieldId="heroBg"
                />
              </div>

              <div className={styles.btnRow} style={{ marginTop: '20px' }}>
                <button type="submit" className={styles.btnPrimary} disabled={saving}>
                  {saving ? 'Saving…' : '💾 Save Hero Section'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ==================== TAB 3: FEATURE SECTIONS ==================== */}
        {activeTab === 'sections' && (
          <form onSubmit={handleSaveConfig} className={styles.form}>
            {/* Section 1: Audio & Video */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Section 1: Audio &amp; Video / HD Calls</h2>
              </div>
              <div className={styles.formGrid2}>
                <div className={styles.inputGroup}>
                  <label className={styles.formLabel}>Badge Text</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={config.sections?.section1?.badgeText || ''}
                    onChange={(e) => updateSectionField('section1', 'badgeText', e.target.value)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.formLabel}>Title</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={config.sections?.section1?.title || ''}
                    onChange={(e) => updateSectionField('section1', 'title', e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.inputGroup} style={{ marginTop: '12px' }}>
                <label className={styles.formLabel}>Description</label>
                <textarea
                  className={styles.textareaInput}
                  value={config.sections?.section1?.desc || ''}
                  onChange={(e) => updateSectionField('section1', 'desc', e.target.value)}
                />
              </div>
              <div style={{ marginTop: '12px' }}>
                <ImageInput
                  label="Phone Mockup Artwork Image"
                  value={config.sections?.section1?.image || ''}
                  onChange={(val) => updateSectionField('section1', 'image', val)}
                  fieldId="sec1Img"
                />
              </div>
            </div>

            {/* Section 2: Global Calls */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Section 2: Global &amp; International Calls</h2>
              </div>
              <div className={styles.formGrid2}>
                <div className={styles.inputGroup}>
                  <label className={styles.formLabel}>Badge Text</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={config.sections?.section2?.badgeText || ''}
                    onChange={(e) => updateSectionField('section2', 'badgeText', e.target.value)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.formLabel}>Title</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={config.sections?.section2?.title || ''}
                    onChange={(e) => updateSectionField('section2', 'title', e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.inputGroup} style={{ marginTop: '12px' }}>
                <label className={styles.formLabel}>Description</label>
                <textarea
                  className={styles.textareaInput}
                  value={config.sections?.section2?.desc || ''}
                  onChange={(e) => updateSectionField('section2', 'desc', e.target.value)}
                />
              </div>
              <div style={{ marginTop: '12px' }}>
                <ImageInput
                  label="Phone Mockup Artwork Image"
                  value={config.sections?.section2?.image || ''}
                  onChange={(val) => updateSectionField('section2', 'image', val)}
                  fieldId="sec2Img"
                />
              </div>
            </div>

            {/* Section 3: Privacy */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Section 3: Privacy / Private Call</h2>
              </div>
              <div className={styles.formGrid2}>
                <div className={styles.inputGroup}>
                  <label className={styles.formLabel}>Badge Text</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={config.sections?.section3?.badgeText || ''}
                    onChange={(e) => updateSectionField('section3', 'badgeText', e.target.value)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.formLabel}>Title</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={config.sections?.section3?.title || ''}
                    onChange={(e) => updateSectionField('section3', 'title', e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.inputGroup} style={{ marginTop: '12px' }}>
                <label className={styles.formLabel}>Description</label>
                <textarea
                  className={styles.textareaInput}
                  value={config.sections?.section3?.desc || ''}
                  onChange={(e) => updateSectionField('section3', 'desc', e.target.value)}
                />
              </div>
              <div style={{ marginTop: '12px' }}>
                <ImageInput
                  label="Phone Mockup Artwork Image"
                  value={config.sections?.section3?.image || ''}
                  onChange={(val) => updateSectionField('section3', 'image', val)}
                  fieldId="sec3Img"
                />
              </div>
            </div>

            {/* Section 4: Security */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Section 4: Security Communication</h2>
              </div>
              <div className={styles.formGrid2}>
                <div className={styles.inputGroup}>
                  <label className={styles.formLabel}>Badge Text</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={config.sections?.section4?.badgeText || ''}
                    onChange={(e) => updateSectionField('section4', 'badgeText', e.target.value)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.formLabel}>Title</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={config.sections?.section4?.title || ''}
                    onChange={(e) => updateSectionField('section4', 'title', e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.inputGroup} style={{ marginTop: '12px' }}>
                <label className={styles.formLabel}>Description</label>
                <textarea
                  className={styles.textareaInput}
                  value={config.sections?.section4?.desc || ''}
                  onChange={(e) => updateSectionField('section4', 'desc', e.target.value)}
                />
              </div>
              <div style={{ marginTop: '12px' }}>
                <ImageInput
                  label="Phone Mockup Artwork Image"
                  value={config.sections?.section4?.image || ''}
                  onChange={(val) => updateSectionField('section4', 'image', val)}
                  fieldId="sec4Img"
                />
              </div>
            </div>

            {/* Section 5: Translation */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Section 5: Instant Message Translation</h2>
              </div>
              <div className={styles.formGrid2}>
                <div className={styles.inputGroup}>
                  <label className={styles.formLabel}>Badge Text</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={config.sections?.section5?.badgeText || ''}
                    onChange={(e) => updateSectionField('section5', 'badgeText', e.target.value)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.formLabel}>Title</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={config.sections?.section5?.title || ''}
                    onChange={(e) => updateSectionField('section5', 'title', e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.inputGroup} style={{ marginTop: '12px' }}>
                <label className={styles.formLabel}>Description</label>
                <textarea
                  className={styles.textareaInput}
                  value={config.sections?.section5?.desc || ''}
                  onChange={(e) => updateSectionField('section5', 'desc', e.target.value)}
                />
              </div>
              <div style={{ marginTop: '12px' }}>
                <ImageInput
                  label="Phone Mockup Artwork Image"
                  value={config.sections?.section5?.image || ''}
                  onChange={(val) => updateSectionField('section5', 'image', val)}
                  fieldId="sec5Img"
                />
              </div>
            </div>

            <div className={styles.btnRow} style={{ marginTop: '20px' }}>
              <button type="submit" className={styles.btnPrimary} disabled={saving}>
                {saving ? 'Saving…' : '💾 Save All Feature Sections'}
              </button>
            </div>
          </form>
        )}

        {/* ==================== TAB 4: THEME & TEXT COLORS ==================== */}
        {activeTab === 'colors' && (
          <form onSubmit={handleSaveConfig} className={styles.form}>
            {/* Quick 1-Click Presets */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>1-Click Theme Presets</h2>
                <p className={styles.cardDesc}>Select a curated harmonious color scheme or customize each color below.</p>
              </div>
              <div className={styles.presetGrid}>
                {THEME_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={styles.presetBtn}
                    onClick={() => applyPreset(preset.colors)}
                  >
                    <span className={styles.presetDot} style={{ backgroundColor: preset.colors.primary }} />
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                className={styles.btnSmall}
                onClick={resetColorsToDefault}
              >
                🔄 Reset All Colors to Default (imo Blue)
              </button>
            </div>

            {/* Global Brand & Button Colors */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Primary Brand &amp; Hero Colors</h2>
                <p className={styles.cardDesc}>Controls download buttons, active navigation links, and hero headlines.</p>
              </div>
              <div className={styles.colorCardGrid}>
                <ColorPickerField label="Primary Theme Color (Buttons & Active Links)" colorKey="primary" defaultHex="#009dff" />
                <ColorPickerField label="Primary Button Hover Color" colorKey="primaryHover" defaultHex="#0088de" />
                <ColorPickerField label="Hero Headline Color" colorKey="heroTitleColor" defaultHex="#009dff" />
                <ColorPickerField label="Hero Subtitle Color" colorKey="heroDescColor" defaultHex="#009dff" />
              </div>
            </div>

            {/* Feature Section Colors */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Feature Section Background &amp; Text Colors</h2>
                <p className={styles.cardDesc}>Customize the background and text color of each individual landing page section.</p>
              </div>
              <div className={styles.colorCardGrid}>
                <ColorPickerField label="Section 1 Background (HD Calls)" colorKey="sec1Bg" defaultHex="#0093ff" />
                <ColorPickerField label="Section 1 Text Color" colorKey="sec1Text" defaultHex="#ffffff" />

                <ColorPickerField label="Section 2 Background (Global Calls)" colorKey="sec2Bg" defaultHex="#131b21" />
                <ColorPickerField label="Section 2 Text Color" colorKey="sec2Text" defaultHex="#009dff" />

                <ColorPickerField label="Section 3 Background (Privacy)" colorKey="sec3Bg" defaultHex="#c8ebff" />
                <ColorPickerField label="Section 3 Text Color" colorKey="sec3Text" defaultHex="#009dff" />

                <ColorPickerField label="Section 4 Background (Security)" colorKey="sec4Bg" defaultHex="#009dff" />
                <ColorPickerField label="Section 4 Text Color" colorKey="sec4Text" defaultHex="#ffffff" />

                <ColorPickerField label="Section 5 Background (Translation)" colorKey="sec5Bg" defaultHex="#c8ebff" />
                <ColorPickerField label="Section 5 Text Color" colorKey="sec5Text" defaultHex="#009dff" />

                <ColorPickerField label="Footer Background Color" colorKey="footerBg" defaultHex="#131b21" />
                <ColorPickerField label="Footer Text Color" colorKey="footerText" defaultHex="#ffffff" />
              </div>
            </div>

            <div className={styles.btnRow} style={{ marginTop: '10px' }}>
              <button type="submit" className={styles.btnPrimary} disabled={saving}>
                {saving ? 'Saving…' : '💾 Save Theme & Text Colors'}
              </button>
            </div>
          </form>
        )}

        {/* ==================== TAB 5: LINKS & REDIRECTS ==================== */}
        {activeTab === 'links' && (
          <form onSubmit={handleSaveConfig} className={styles.form}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Navigation &amp; Redirect URLs</h2>
                <p className={styles.cardDesc}>Control where any link or button redirects (leave blank for disabled / in-page actions).</p>
              </div>

              <div className={styles.formGrid2}>
                <div className={styles.inputGroup}>
                  <label className={styles.formLabel}>Header: "imo Web" Button Redirect</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={config.links?.imoWebUrl || ''}
                    onChange={(e) => updateField('links', 'imoWebUrl', e.target.value)}
                    placeholder="https://web.imo.im or /custom-path (leave blank to disable)"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.formLabel}>Header: "Blog" Link Redirect</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={config.links?.blogUrl || ''}
                    onChange={(e) => updateField('links', 'blogUrl', e.target.value)}
                    placeholder="https://... (leave blank to disable)"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.formLabel}>Header: "Help Center" Link Redirect</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={config.links?.helpCenterUrl || ''}
                    onChange={(e) => updateField('links', 'helpCenterUrl', e.target.value)}
                    placeholder="https://... (leave blank to disable)"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.formLabel}>Header: "Apps" Link Redirect</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={config.links?.appsUrl || ''}
                    onChange={(e) => updateField('links', 'appsUrl', e.target.value)}
                    placeholder="https://... (leave blank to disable)"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.formLabel}>Footer: "About Us" Link</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={config.links?.aboutUsUrl || ''}
                    onChange={(e) => updateField('links', 'aboutUsUrl', e.target.value)}
                    placeholder="https://... (leave blank to disable)"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.formLabel}>Footer: "Policy" Link</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={config.links?.policyUrl || ''}
                    onChange={(e) => updateField('links', 'policyUrl', e.target.value)}
                    placeholder="https://... (leave blank to disable)"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.formLabel}>Footer: "Facebook" Social Link</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={config.links?.facebookUrl || ''}
                    onChange={(e) => updateField('links', 'facebookUrl', e.target.value)}
                    placeholder="https://facebook.com/... (leave blank to disable)"
                  />
                </div>
              </div>

              <div className={styles.btnRow} style={{ marginTop: '20px' }}>
                <button type="submit" className={styles.btnPrimary} disabled={saving}>
                  {saving ? 'Saving…' : '💾 Save Redirect Links'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ==================== TAB 6: APK MANAGER ==================== */}
        {activeTab === 'apk' && (
          <div className={styles.form}>
            {/* 1. Active APK Card */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitleWrap}>
                  <h2 className={styles.cardTitle}>Current Active APK Download Source</h2>
                  {currentApkUrl ? (
                    <span className={styles.activeBadge}>● Active &amp; Ready</span>
                  ) : (
                    <span className={styles.inactiveBadge}>○ Not Configured</span>
                  )}
                </div>
                <p className={styles.cardDesc}>This file is delivered whenever visitors tap "Download Now" on phone or PC.</p>
              </div>

              <div className={styles.currentUrlBox}>
                {currentApkUrl ? (
                  <div className={styles.urlDisplayRow}>
                    <div className={styles.urlChip}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      <span className={styles.urlText}>{currentApkUrl}</span>
                    </div>
                    <div className={styles.quickActions}>
                      <button className={styles.btnSmall} onClick={handleCopyUrl} title="Copy URL">
                        {copied ? '✓ Copied' : 'Copy'}
                      </button>
                      <button className={styles.btnSmallPrimary} onClick={handleTestDownload} title="Test Download">
                        Test Download
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.emptyWarning}>
                    <p>⚠️ No APK is currently configured. Clicking download will show a "not configured" notice.</p>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Set Custom URL */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Set External or Hosted APK Download Link</h2>
                <p className={styles.cardDesc}>Paste any direct download link (e.g. <code>https://example.com/imo.apk</code>) or an internal path.</p>
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="https://example.com/imo.apk  or  /apk/imo.apk"
                  value={config.apk?.apkUrl || ''}
                  onChange={(e) => updateField('apk', 'apkUrl', e.target.value)}
                />
              </div>
              <div className={styles.btnRow} style={{ marginTop: '12px' }}>
                <button
                  type="button"
                  className={styles.btnPrimary}
                  disabled={saving}
                  onClick={handleSaveConfig}
                >
                  {saving ? 'Saving…' : 'Save APK URL'}
                </button>
                <button
                  type="button"
                  className={styles.btnDanger}
                  disabled={saving}
                  onClick={() => {
                    updateField('apk', 'apkUrl', '');
                    saveApkUrlAction('');
                  }}
                >
                  Clear
                </button>
              </div>
            </div>

            {/* 3. Direct File Upload */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Upload APK Package Directly</h2>
                <p className={styles.cardDesc}>Upload an Android .apk package from your phone or PC. It will be stored and auto-activated.</p>
              </div>
              <div className={styles.uploadZone} onClick={() => apkFileRef.current?.click()} id="upload-zone">
                <input
                  ref={apkFileRef}
                  type="file"
                  accept=".apk,application/vnd.android.package-archive,application/octet-stream,*/*"
                  style={{ display: 'none' }}
                  onChange={handleApkUpload}
                />
                {apkUploading ? (
                  <div className={styles.uploadingState}>
                    <div className={styles.spinner}></div>
                    <span>{apkProgress || 'Uploading & activating APK package…'}</span>
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
                    <p className={styles.uploadHint}>Saved to <code>/public/apk/</code></p>
                    <button
                      type="button"
                      className={styles.btnUploadSmall}
                      onClick={(e) => {
                        e.stopPropagation();
                        apkFileRef.current?.click();
                      }}
                    >
                      Choose File from Device
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 7: SECURITY / PASSWORD ==================== */}
        {activeTab === 'security' && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitleWrap}>
                <h2 className={styles.cardTitle}>Change Admin Password</h2>
                <span className={styles.securityBadge}>🔒 Security</span>
              </div>
              <p className={styles.cardDesc}>Update your administrator password to keep your dashboard secure.</p>
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
                  required
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
                    required
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
                  required
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
        )}
      </main>
    </div>
  );
}
