'use client';

import { useState, useEffect } from 'react';
import styles from './playstore.module.css';
import DownloadButton from './DownloadButton';

export default function PlayStoreView({ initialConfig = {} }) {
  const [config, setConfig] = useState(initialConfig);
  const [showFullAbout, setShowFullAbout] = useState(false);

  useEffect(() => {
    fetch(`/api/site-config?_t=${Date.now()}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.config) {
          setConfig(data.config);
        }
      })
      .catch(() => {});
  }, []);

  const play = config.playStore || {};
  const site = config.site || {};

  const appName = (play.appName && play.appName !== 'imo video calls and chat')
    ? play.appName
    : (site.name && site.name !== 'imo' ? site.name : (play.appName || 'WhatsApp'));

  const developer = (play.developer && play.developer !== 'imo.im')
    ? play.developer
    : (site.name && site.name !== 'imo' ? `${site.name} LLC` : 'imo.im');

  const appIcon = play.appIcon || site.logoUrl || '/imo_files/imo.30ad61b6.png';
  const rating = play.rating || '4.3';
  const reviewsCount = play.reviewsCount || '1M reviews';
  const downloads = play.downloads || '500M+';
  const contentRating = play.contentRating || 'Rated for 3+';
  const category = play.category || 'Communication';
  const updatedOn = play.updatedOn || 'Aug 14, 2026';
  const containsAds = play.containsAds || 'Contains ads · In-app purchases';

  const defaultScreenshots = [
    '/imo_files/bg-video-call.6259fb3f.png',
    '/imo_files/global-call.a744bcae.png',
    '/imo_files/bg-private.2df28805.png',
    '/imo_files/bg-secure.6c5e7e8b.png',
    '/imo_files/bg-translate.9257ccaa.png',
  ];

  const screenshots = (play.screenshots && play.screenshots.length > 0) ? play.screenshots : defaultScreenshots;

  const aboutDescription = play.aboutDescription || `${appName} is a free, simple, and secure video calling & instant messaging app. Send text or voice messages or call with your friends and family easily and quickly, even with a poor network signal.

✔️ Compatible with all networks: Free and unlimited instant messages and audio or video calls over 2G, 3G, 4G, 5G, or Wi-Fi.
✔️ High-quality audio & video: Crystal clear calls to keep in touch with family.
✔️ Multi-media sharing: Fast photo and video sharing, voice messages, and documents.
✔️ Security & Privacy: Keep all your personal chats and communications confidential.`;

  const whatsNew = play.whatsNew || `• Improved connection stability for calls\n• Bug fixes and overall performance improvements\n• Enhanced reliability and speed`;

  const apkDownloadName = `${appName.replace(/[^a-zA-Z0-9._\-]/g, '_')}.apk`;

  return (
    <div className={styles.playStoreWrap}>
      {/* ===== GOOGLE PLAY NAVBAR ===== */}
      <header className={styles.navbar}>
        <div className={styles.logoArea}>
          <svg className={styles.playLogoSvg} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4285F4" d="M19.7 19.3L4.8 4.2C4.5 4.6 4.3 5.1 4.3 5.8v28.4c0 .7.2 1.2.5 1.6l14.9-16.5z"/>
            <path fill="#EA4335" d="M24.7 14.3L19.7 19.3 4.8 4.2C5.3 3.7 6.1 3.5 7 4l17.7 10.3z"/>
            <path fill="#FBBC04" d="M30.4 17.6l-5.7-3.3-5 5 5 5 5.7-3.3c1.3-.8 1.3-2.6 0-3.4z"/>
            <path fill="#34A853" d="M19.7 19.3l5 5-17.7 10.3c-.9.5-1.7.3-2.2-.2l14.9-15.1z"/>
          </svg>
          <span className={styles.brandTitle}>Google Play</span>
        </div>

        <nav className={styles.navLinks}>
          <a href="#" className={styles.navLink}>Games</a>
          <a href="#" className={`${styles.navLink} ${styles.navLinkActive}`}>Apps</a>
          <a href="#" className={styles.navLink}>Movies</a>
          <a href="#" className={styles.navLink}>Books</a>
          <a href="#" className={styles.navLink}>Kids</a>
        </nav>

        <div className={styles.navRight}>
          <button className={styles.iconBtn} aria-label="Search" title="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
          <button className={styles.iconBtn} aria-label="Help" title="Help">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </button>
          <div className={styles.avatarCircle} title="Google Account">G</div>
        </div>
      </header>

      {/* ===== MAIN PLAY STORE DETAILS HERO ===== */}
      <main className={styles.mainContainer}>
        <section className={styles.heroSection}>
          <div className={styles.appHeaderLeft}>
            {/* App Icon */}
            <div className={styles.iconWrapper}>
              <img
                src={appIcon}
                alt={`${appName} Icon`}
                className={styles.appIcon}
                onError={(e) => { e.currentTarget.src = '/imo_files/imo.30ad61b6.png'; }}
              />
            </div>

            {/* Title & Developer Meta */}
            <div className={styles.metaInfo}>
              <h1 className={styles.appTitle}>{appName}</h1>
              <p className={styles.developerName}>{developer}</p>
              <p className={styles.adsNotice}>{containsAds}</p>
            </div>
          </div>
        </section>

        {/* Ratings, Content Rating, Downloads Row */}
        <section className={styles.metricsBar}>
          <div className={styles.metricItem}>
            <div className={styles.metricValue}>
              <span>{rating}</span>
              <span className={styles.starIcon}>★</span>
            </div>
            <p className={styles.metricLabel}>{reviewsCount}</p>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.metricItem}>
            <span className={styles.metricValue}>{downloads}</span>
            <p className={styles.metricLabel}>Downloads</p>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.metricItem}>
            <span className={styles.ageBadge}>3+</span>
            <p className={styles.metricLabel}>{contentRating}</p>
          </div>
        </section>

        {/* Install CTA Button (Uses global DownloadButton for APK triggers) */}
        <section className={styles.actionsRow}>
          <DownloadButton className={styles.installBtn} filename={apkDownloadName}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            <span>Install</span>
          </DownloadButton>

          <DownloadButton className={styles.secondaryActionBtn} filename={apkDownloadName}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
            <span>Direct APK Download</span>
          </DownloadButton>
        </section>

        {/* Device Compatibility Notice */}
        <div className={styles.deviceInfoRow}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
            <line x1="12" y1="18" x2="12.01" y2="18"></line>
          </svg>
          <span>This app is compatible with all of your devices</span>
        </div>

        {/* Screenshots Carousel */}
        <section className={styles.screenshotsSection}>
          <div className={styles.screenshotsScroll}>
            {screenshots.map((src, idx) => (
              <div key={idx} className={styles.screenshotCard}>
                <img
                  src={src}
                  alt={`Screenshot ${idx + 1}`}
                  className={styles.screenshotImg}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* About this app */}
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader} onClick={() => setShowFullAbout(!showFullAbout)}>
            <h2 className={styles.sectionTitle}>About this app</h2>
            <span className={styles.sectionArrow}>{showFullAbout ? '▲' : '➔'}</span>
          </div>
          <div className={`${styles.aboutBody} ${showFullAbout ? styles.aboutBodyOpen : ''}`}>
            {aboutDescription.split('\n\n').map((para, i) => (
              <p key={i} className={styles.paragraph}>{para}</p>
            ))}
          </div>

          <div className={styles.tagsRow}>
            <span className={styles.tagPill}>#{category}</span>
            <span className={styles.tagPill}>#Top free</span>
            <span className={styles.tagPill}>#Instant messaging</span>
          </div>

          <div className={styles.metaGrid}>
            <div className={styles.metaCell}>
              <span className={styles.cellLabel}>Updated on</span>
              <span className={styles.cellValue}>{updatedOn}</span>
            </div>
            <div className={styles.metaCell}>
              <span className={styles.cellLabel}>Downloads</span>
              <span className={styles.cellValue}>{downloads}</span>
            </div>
            <div className={styles.metaCell}>
              <span className={styles.cellLabel}>Required OS</span>
              <span className={styles.cellValue}>Android 5.0 and up</span>
            </div>
            <div className={styles.metaCell}>
              <span className={styles.cellLabel}>Offered by</span>
              <span className={styles.cellValue}>{developer}</span>
            </div>
          </div>
        </section>

        {/* What's New */}
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>What's new</h2>
          </div>
          <div className={styles.sectionBody}>
            {whatsNew.split('\n').map((line, i) => (
              <p key={i} className={styles.whatsNewLine}>{line}</p>
            ))}
          </div>
        </section>

        {/* Data safety */}
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Data safety</h2>
            <span className={styles.sectionArrow}>➔</span>
          </div>
          <p className={styles.sectionSubtitle}>
            Safety starts with understanding how developers collect and share your data. Data privacy and security practices may vary based on your use, region, and age.
          </p>
          <div className={styles.safetyBox}>
            <div className={styles.safetyItem}>
              <span className={styles.safetyIcon}>🔒</span>
              <div>
                <strong>Data is encrypted in transit</strong>
                <p>Your communications are transferred over a secure connection</p>
              </div>
            </div>
            <div className={styles.safetyItem}>
              <span className={styles.safetyIcon}>🗑️</span>
              <div>
                <strong>You can request that data be deleted</strong>
                <p>The developer provides a way for you to request that your data be deleted</p>
              </div>
            </div>
          </div>
        </section>

        {/* Ratings & reviews preview */}
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Ratings and reviews</h2>
            <span className={styles.sectionArrow}>➔</span>
          </div>
          <div className={styles.ratingSummaryRow}>
            <div className={styles.ratingBigNumber}>
              <span className={styles.scoreNumber}>{rating}</span>
              <div className={styles.starsRow}>
                <span>★</span><span>★</span><span>★</span><span>★</span><span className={styles.starHalf}>★</span>
              </div>
              <span className={styles.reviewsCount}>{reviewsCount}</span>
            </div>
            <div className={styles.ratingBars}>
              <div className={styles.barRow}>
                <span>5</span>
                <div className={styles.barTrack}><div className={styles.barFill} style={{ width: '75%' }}></div></div>
              </div>
              <div className={styles.barRow}>
                <span>4</span>
                <div className={styles.barTrack}><div className={styles.barFill} style={{ width: '15%' }}></div></div>
              </div>
              <div className={styles.barRow}>
                <span>3</span>
                <div className={styles.barTrack}><div className={styles.barFill} style={{ width: '5%' }}></div></div>
              </div>
              <div className={styles.barRow}>
                <span>2</span>
                <div className={styles.barTrack}><div className={styles.barFill} style={{ width: '2%' }}></div></div>
              </div>
              <div className={styles.barRow}>
                <span>1</span>
                <div className={styles.barTrack}><div className={styles.barFill} style={{ width: '3%' }}></div></div>
              </div>
            </div>
          </div>
        </section>

        {/* Developer Contact */}
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Developer contact</h2>
            <span className={styles.sectionArrow}>➔</span>
          </div>
          <div className={styles.sectionBody}>
            <p>🌐 Application: {appName}</p>
            <p>📧 Support: Developer Support Team</p>
            <p>📍 Package: Verified Official Package</p>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className={styles.playFooter}>
        <div className={styles.footerLinks}>
          <a href="#" className={styles.footerLink}>Google Play Terms of Service</a>
          <a href="#" className={styles.footerLink}>Privacy Policy</a>
          <a href="#" className={styles.footerLink}>About Google Play</a>
          <a href="#" className={styles.footerLink}>Developers</a>
        </div>
        <p>© 2026 Google LLC. All rights reserved.</p>
      </footer>
    </div>
  );
}
