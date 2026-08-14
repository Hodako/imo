'use client';

import { useState, useEffect } from 'react';
import styles from './playstore.module.css';
import DownloadButton from './DownloadButton';

export default function PlayStoreView({ initialConfig = {} }) {
  const [config, setConfig] = useState(initialConfig);
  const [showFullAbout, setShowFullAbout] = useState(false);

  useEffect(() => {
    fetch('/api/site-config')
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

  const appName = play.appName || site.name || 'imo video calls and chat';
  const developer = play.developer || 'imo.im';
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

  const aboutDescription = play.aboutDescription || `imo is a free, simple, and faster video calling & instant messaging app. Send text or voice messages or video call with your friends and family easily and quickly, even with a poor network signal.

✔️ Compatible with all networks: Free and unlimited instant messages and audio or video calls over 2G, 3G, 4G, 5G, or Wi-Fi.
✔️ High-quality audio & video: Crystal clear & HD video calls to keep in touch with family.
✔️ Multi-media sharing: Fast photo and video sharing, voice messages, and documents.
✔️ International calls: Make free international calls to your loved ones without extra charges.`;

  const whatsNew = play.whatsNew || `• Improved connection stability for HD video calls\n• Bug fixes and overall performance improvements\n• Enhanced instant message translation accuracy`;

  return (
    <div className={styles.playStoreWrap}>
      {/* ===== GOOGLE PLAY NAVBAR ===== */}
      <header className={styles.navbar}>
        <div className={styles.logoArea}>
          <svg className={styles.playLogoSvg} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" d="M0,0h40v40H0V0z" />
            <g>
              <path d="M19.7,19.2L4.3,35.3c0,0,0,0,0,0c0.5,1.7,2.1,3,4,3c0.8,0,1.5-0.2,2.1-0.6l0,0l17.4-9.9L19.7,19.2z" fill="#EA4335" />
              <path d="M35.3,16.4L35.3,16.4l-7.5-4.3l-8.4,7.4l8.5,8.3l7.5-4.2c1.3-0.7,2.2-2.1,2.2-3.6C37.5,18.5,36.6,17.1,35.3,16.4z" fill="#FBBC04" />
              <path d="M4.3,4.7C4.2,5,4.2,5.4,4.2,5.8v28.5c0,0.4,0,0.7,0.1,1.1l16-15.7L4.3,4.7z" fill="#4285F4" />
              <path d="M19.8,20l8-7.9L10.5,2.3C9.9,1.9,9.1,1.7,8.3,1.7c-1.9,0-3.6,1.3-4,3c0,0,0,0,0,0L19.8,20z" fill="#34A853" />
            </g>
          </svg>
          <span className={styles.playLogoText}>
            Google <strong>Play</strong>
          </span>
        </div>

        <div className={styles.navIcons}>
          <button className={styles.navIconBtn} aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          <button className={styles.navIconBtn} aria-label="Help">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </button>
          <div className={styles.profileAvatar}>
            <span>U</span>
          </div>
        </div>
      </header>

      {/* ===== MAIN BODY ===== */}
      <main className={styles.mainContainer}>
        {/* App Title and Icon Header */}
        <section className={styles.appHeader}>
          <img src={appIcon} alt={appName} className={styles.appIcon} />
          <div className={styles.appTitleCol}>
            <h1 className={styles.appName}>{appName}</h1>
            <p className={styles.appDeveloper}>{developer}</p>
            <p className={styles.appTags}>{containsAds}</p>
          </div>
        </section>

        {/* Metrics Row */}
        <section className={styles.metricsRow}>
          <div className={styles.metricItem}>
            <p className={styles.metricValue}>
              <span>{rating}</span>
              <span className={styles.ratingStar}>★</span>
            </p>
            <p className={styles.metricLabel}>{reviewsCount}</p>
          </div>

          <div className={styles.metricDivider} />

          <div className={styles.metricItem}>
            <p className={styles.metricValue}>{downloads}</p>
            <p className={styles.metricLabel}>Downloads</p>
          </div>

          <div className={styles.metricDivider} />

          <div className={styles.metricItem}>
            <span className={styles.ageBadge}>3+</span>
            <p className={styles.metricLabel}>{contentRating}</p>
          </div>
        </section>

        {/* Install CTA Button (Uses global DownloadButton for APK triggers) */}
        <section className={styles.actionsRow}>
          <DownloadButton className={styles.installBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            <span>Install</span>
          </DownloadButton>

          <DownloadButton className={styles.secondaryActionBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
            <span>Open in Play Store App</span>
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
              <div key={idx} className={styles.screenshotItem}>
                <img src={src} alt={`App screenshot ${idx + 1}`} className={styles.screenshotImg} />
              </div>
            ))}
          </div>
        </section>

        {/* About this app */}
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader} onClick={() => setShowFullAbout(!showFullAbout)}>
            <h2 className={styles.sectionTitle}>About this app</h2>
            <span className={styles.sectionArrow}>➔</span>
          </div>
          <div className={styles.sectionBody}>
            {showFullAbout ? (
              <p>{aboutDescription}</p>
            ) : (
              <p>{aboutDescription.length > 220 ? `${aboutDescription.slice(0, 220)}...` : aboutDescription}</p>
            )}
          </div>
          <div className={styles.pillTags}>
            <span className={styles.pillTag}>Updated on {updatedOn}</span>
            <span className={styles.pillTag}>#{category}</span>
          </div>
        </section>

        {/* What's New */}
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>What's new</h2>
          </div>
          <div className={styles.sectionBody}>
            <p>{whatsNew}</p>
          </div>
        </section>

        {/* Data Safety */}
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Data safety</h2>
            <span className={styles.sectionArrow}>➔</span>
          </div>
          <p className={styles.sectionBody} style={{ marginBottom: '10px' }}>
            Safety starts with understanding how developers collect and share your data. Data privacy and security practices may vary based on your use, region, and age.
          </p>

          <div className={styles.dataSafetyBox}>
            <div className={styles.dataSafetyItem}>
              <svg className={styles.dataSafetyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              <div>
                <p className={styles.dataSafetyItemTitle}>No data shared with third parties</p>
                <p className={styles.dataSafetyItemDesc}>The developer says this app doesn't share user data with other companies or organizations.</p>
              </div>
            </div>

            <div className={styles.dataSafetyItem}>
              <svg className={styles.dataSafetyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <div>
                <p className={styles.dataSafetyItemTitle}>Data is encrypted in transit</p>
                <p className={styles.dataSafetyItemDesc}>Your data is transferred over a secure, encrypted HTTPS connection.</p>
              </div>
            </div>

            <div className={styles.dataSafetyItem}>
              <svg className={styles.dataSafetyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              <div>
                <p className={styles.dataSafetyItemTitle}>You can request that data be deleted</p>
                <p className={styles.dataSafetyItemDesc}>The developer provides a way for you to request that your personal data be removed.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Ratings and Reviews */}
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Ratings and reviews</h2>
            <span className={styles.sectionArrow}>➔</span>
          </div>

          <div className={styles.ratingsOverview}>
            <div>
              <p className={styles.bigRating}>{rating}</p>
              <div className={styles.starsRow}>
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
              <p className={styles.totalReviewsText}>{reviewsCount}</p>
            </div>

            <div className={styles.barsColumn}>
              <div className={styles.barRow}>
                <span>5</span>
                <div className={styles.barTrack}><div className={styles.barFill} style={{ width: '75%' }} /></div>
              </div>
              <div className={styles.barRow}>
                <span>4</span>
                <div className={styles.barTrack}><div className={styles.barFill} style={{ width: '15%' }} /></div>
              </div>
              <div className={styles.barRow}>
                <span>3</span>
                <div className={styles.barTrack}><div className={styles.barFill} style={{ width: '5%' }} /></div>
              </div>
              <div className={styles.barRow}>
                <span>2</span>
                <div className={styles.barTrack}><div className={styles.barFill} style={{ width: '2%' }} /></div>
              </div>
              <div className={styles.barRow}>
                <span>1</span>
                <div className={styles.barTrack}><div className={styles.barFill} style={{ width: '3%' }} /></div>
              </div>
            </div>
          </div>

          {/* Sample Reviews */}
          <div className={styles.reviewItem}>
            <div className={styles.reviewHeader}>
              <div className={styles.reviewerAvatar}>J</div>
              <p className={styles.reviewerName}>Johnathan Miller</p>
            </div>
            <div className={styles.reviewMeta}>
              <span className={styles.starsRow} style={{ fontSize: '12px' }}>★★★★★</span>
              <span className={styles.reviewDate}>August 10, 2026</span>
            </div>
            <p className={styles.reviewText}>
              The call quality is outstanding even on slower mobile networks! HD video calls never lag and messaging is instant. Highly recommended.
            </p>
          </div>

          <div className={styles.reviewItem}>
            <div className={styles.reviewHeader}>
              <div className={styles.reviewerAvatar}>S</div>
              <p className={styles.reviewerName}>Sarah Jenkins</p>
            </div>
            <div className={styles.reviewMeta}>
              <span className={styles.starsRow} style={{ fontSize: '12px' }}>★★★★★</span>
              <span className={styles.reviewDate}>July 28, 2026</span>
            </div>
            <p className={styles.reviewText}>
              Very reliable app for international family calls. Clear audio, smooth interface, and zero interruptions!
            </p>
          </div>
        </section>

        {/* Developer Contact */}
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Developer contact</h2>
            <span className={styles.sectionArrow}>➔</span>
          </div>
          <div className={styles.sectionBody}>
            <p>🌐 Website: https://imo.im</p>
            <p>📧 Email: support@imo.im</p>
            <p>📍 Address: 5120 Great America Pkwy, Santa Clara, CA 95054</p>
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
