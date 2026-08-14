'use client';

import { useState } from 'react';
import DownloadButton from './DownloadButton';

export default function HomeView() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div data-v-3d13c7c6="" data-v-56b2566a="" className="layout home">
      {/* ===== DESKTOP HEADER (Matches Screenshot) ===== */}
      <header data-v-e4c80980="" data-v-3d13c7c6="" className="header desktop-header" id="imoHeader">
        <div data-v-e4c80980="" className="desktop-header-container max-width flex a-center j-between">
          
          {/* Left: Logo */}
          <div data-v-e4c80980="" className="icon-logo desktop-logo">
            <a href="/">
              <img data-v-e4c80980="" alt="imo logo" src="/imo_files/imo.30ad61b6.png" className="desktop-logo-img" />
            </a>
          </div>

          {/* Center: Navigation Menu */}
          <ul data-v-e4c80980="" className="flex a-center j-center desktop-nav-menu">
            <li data-v-e4c80980="" className="desktop-nav-item active">
              <a data-v-e4c80980="" href="/" className="desktop-nav-link active">Home</a>
            </li>
            <li data-v-e4c80980="" className="desktop-nav-item">
              <div data-v-8d9519de="" data-v-e4c80980="" className="dropdown">
                <a href="https://imo.im/blog" className="desktop-nav-link flex a-center">
                  <span>Blog</span>
                  <svg width="10" height="6" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="nav-chevron">
                    <path d="M1.4 0L6 4.6L10.6 0L12 1.4L6 7.4L0 1.4L1.4 0Z" fill="currentColor" />
                  </svg>
                </a>
              </div>
            </li>
            <li data-v-e4c80980="" className="desktop-nav-item">
              <div data-v-8d9519de="" data-v-e4c80980="" className="dropdown">
                <a data-v-e4c80980="" href="https://imo.im/faq" className="desktop-nav-link flex a-center">
                  <span>Help Center</span>
                  <svg width="10" height="6" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="nav-chevron">
                    <path d="M1.4 0L6 4.6L10.6 0L12 1.4L6 7.4L0 1.4L1.4 0Z" fill="currentColor" />
                  </svg>
                </a>
              </div>
            </li>
            <li data-v-e4c80980="" className="desktop-nav-item">
              <a data-v-e4c80980="" href="https://imo.im/log" className="desktop-nav-link">Apps</a>
            </li>
          </ul>

          {/* Right: Actions (imo Web > and Download ⤓) */}
          <div className="desktop-header-actions flex a-center">
            <a
              href="https://web.imo.im/?source=official-header"
              target="_blank"
              rel="noopener noreferrer"
              className="desktop-header-web-btn flex a-center j-center"
            >
              <span>imo Web</span>
              <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 9L5 5L1 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <DownloadButton className="desktop-header-download-btn flex a-center j-center">
              <span>Download</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </DownloadButton>
          </div>

        </div>
      </header>

      {/* ===== MOBILE MINI HEADER ===== */}
      <header data-v-3bbe0e34="" data-v-3d13c7c6="" className="mini-header bg-white" id="miniHeader">
        <div className="mini-header-inner">
          <button
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.6" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          <div className="mobile-header-logo">
            <a href="/">
              <img width="42" height="42" alt="imo logo" src="/imo_files/imo.30ad61b6.png" />
            </a>
          </div>

          <DownloadButton className="mobile-header-download-pill" style={{ cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </DownloadButton>
        </div>
      </header>

      {/* ===== MOBILE NAV DRAWER ===== */}
      {mobileMenuOpen && (
        <div className="mobile-nav-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-nav-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-nav-header">
              <img src="/imo_files/imo.30ad61b6.png" alt="imo logo" className="mobile-nav-logo" />
              <button className="mobile-nav-close" onClick={() => setMobileMenuOpen(false)}>✕</button>
            </div>
            <ul className="mobile-nav-links">
              <li><a href="/" onClick={() => setMobileMenuOpen(false)}>🏠 Home</a></li>
              <li><a href="https://imo.im/blog" target="_blank" rel="noopener noreferrer">📝 Blog</a></li>
              <li><a href="https://imo.im/faq" target="_blank" rel="noopener noreferrer">❓ Help Center</a></li>
              <li><a href="https://imo.im/log" target="_blank" rel="noopener noreferrer">📱 Apps</a></li>
              <li><a href="https://web.imo.im/?source=official-header" target="_blank" rel="noopener noreferrer">🌐 imo Web</a></li>
            </ul>
            <div className="mobile-nav-cta">
              <DownloadButton className="mobile-drawer-download-btn">
                <AndroidRobotSVG />
                <span>Download Now</span>
              </DownloadButton>
            </div>
          </div>
        </div>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <div data-v-3d13c7c6="" className="content max-width">
        <div data-v-56b2566a="" data-v-3d13c7c6="" className="container">

          {/* ===== HERO SECTION (Matches Screenshot) ===== */}
          <div data-v-56b2566a="" data-v-3d13c7c6="" className="top hero-section">
            <div data-v-56b2566a="" data-v-3d13c7c6="" className="max-width flex hero-flex">
              
              {/* Left Column (Headline, Subtitle, Download CTA, Platforms) */}
              <div data-v-56b2566a="" data-v-3d13c7c6="" className="top-left hero-text-col">
                <h1 data-v-56b2566a="" data-v-3d13c7c6="" className="top-left__title hero-main-title">
                  Free, Simple,<br className="desktop-br" /> and Secure
                </h1>
                <p data-v-56b2566a="" data-v-3d13c7c6="" className="top-left__desc hero-main-desc">
                  Connect with your loved ones through calls and messages.
                </p>

                {/* Desktop Primary Download Button (Matches Screenshot) */}
                <div className="desktop-hero-cta-wrap desktop-only-cta">
                  <DownloadButton className="desktop-hero-download-btn">
                    <span>Download</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                  </DownloadButton>
                </div>

                {/* Desktop Platform Icons Row (Chrome, Windows, Mac, Android, More Versions >) */}
                <div className="desktop-platforms-row desktop-only-cta">
                  <div className="desktop-platform-icons">
                    <span className="desktop-platform-icon-wrap" title="Chrome / Browser">
                      <img src="/imo_files/icon-mac-blue.e9c0aaa1.png" alt="Browser" className="plat-icon" />
                    </span>
                    <span className="desktop-platform-icon-wrap" title="Windows">
                      <img src="/imo_files/icon-win-blue.3a090cce.png" alt="Windows" className="plat-icon" />
                    </span>
                    <span className="desktop-platform-icon-wrap" title="Apple / Mac / iOS">
                      <img src="/imo_files/icon-ios-blue.9a8ec9e9.png" alt="iOS/Mac" className="plat-icon" />
                    </span>
                    <span className="desktop-platform-icon-wrap" title="Android">
                      <img src="/imo_files/icon-android-blue.992186a1.png" alt="Android" className="plat-icon" />
                    </span>
                  </div>
                  <DownloadButton className="desktop-more-versions-btn">
                    More Versions &gt;
                  </DownloadButton>
                </div>
              </div>

              {/* Right Column: Hero Artwork Collage */}
              <div data-v-56b2566a="" data-v-3d13c7c6="" className="top-right hero-image-col">
                <div data-v-56b2566a="" data-v-3d13c7c6="" className="img-wrapper desktop-hero-img-wrap">
                  <div data-v-56b2566a="" data-v-3d13c7c6="" className="fixed-topbg">
                    <img
                      data-v-56b2566a=""
                      data-v-3d13c7c6=""
                      alt="imo calls and messages"
                      className="top-right__bg hero-artwork-img"
                      src="/imo_files/bg-home-first-image.842b02fa.png"
                    />
                  </div>
                </div>
              </div>

              {/* Mobile-only Download CTA */}
              <div className="mobile-hero-cta">
                <DownloadButton className="mobile-direct-download-btn" style={{ cursor: 'pointer' }}>
                  <AndroidRobotSVG />
                  <span className="btn-text">Download Now</span>
                </DownloadButton>
                <div className="mobile-more-versions">
                  <DownloadButton className="mobile-more-versions-link" style={{ cursor: 'pointer' }}>
                    More Versions &gt;
                  </DownloadButton>
                </div>
              </div>

            </div>
          </div>

          {/* ===== SECTION 1: FREE, SECURE, HD CALLS ===== */}
          <section data-v-56b2566a="" data-v-3d13c7c6="" id="audio" className="feature-section audio-section">
            <div data-v-56b2566a="" data-v-3d13c7c6="" className="section-container vedio-section h-768">
              <div data-v-56b2566a="" data-v-3d13c7c6="" className="max-width flex">
                <div data-v-56b2566a="" data-v-3d13c7c6="" className="left">
                  <div data-v-56b2566a="" data-v-3d13c7c6="" className="left__header audio-section-badge">
                    <img data-v-56b2566a="" data-v-3d13c7c6="" src="/imo_files/icon-video-light.d5af9c91.png" alt="vedioIcon" />
                    <span data-v-56b2566a="" data-v-3d13c7c6="">Audio &amp; Video</span>
                  </div>
                  <h2 data-v-56b2566a="" data-v-3d13c7c6="" className="left__title audio-section-title">
                    Free, Secure, HD Calls
                  </h2>
                  <p data-v-56b2566a="" data-v-3d13c7c6="" className="left__desc audio-section-desc">
                    Enjoy smooth audio and video calls to stay connected with friends anytime, anywhere.
                  </p>
                </div>
                <div data-v-56b2566a="" data-v-3d13c7c6="" className="right audio-section-right">
                  <div data-v-56b2566a="" data-v-3d13c7c6="" className="right-img audio-section-img-wrap">
                    <img data-v-56b2566a="" data-v-3d13c7c6="" src="/imo_files/bg-video-call.6259fb3f.png" alt="Free Secure HD Calls Video Call" className="audio-section-img" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== SECTION 2: FREE INTERNATIONAL CALLS ===== */}
          <section data-v-56b2566a="" data-v-3d13c7c6="" id="global-call" className="feature-section global-call-section-wrap">
            <div data-v-56b2566a="" data-v-3d13c7c6="" className="section-container global-call-section h-780">
              <div data-v-56b2566a="" data-v-3d13c7c6="" className="max-width flex">
                <div data-v-56b2566a="" data-v-3d13c7c6="" className="left">
                  <div data-v-56b2566a="" data-v-3d13c7c6="" className="left__header">
                    <img data-v-56b2566a="" data-v-3d13c7c6="" src="/imo_files/icon-video-dark.229c7d5c.png" alt="videoIcon" />
                    <span data-v-56b2566a="" data-v-3d13c7c6="">Audio &amp; Video</span>
                  </div>
                  <h2 data-v-56b2566a="" data-v-3d13c7c6="" className="left__title"> Free International Calls </h2>
                  <p data-v-56b2566a="" data-v-3d13c7c6="" className="left__desc"> Make free international voice and video calls with friends and family, featuring clear and reliable quality. </p>
                </div>
                <div data-v-56b2566a="" data-v-3d13c7c6="" className="right">
                  <div data-v-56b2566a="" data-v-3d13c7c6="" className="right-img">
                    <img data-v-56b2566a="" data-v-3d13c7c6="" src="/imo_files/global-call.a744bcae.png" alt="Free International Calls Phone Screen" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== SECTION 3: PRIVATE SECTION ===== */}
          <section data-v-56b2566a="" data-v-3d13c7c6="" id="secure" className="feature-section">
            <div data-v-56b2566a="" data-v-3d13c7c6="" className="section-container private-section h-823">
              <div data-v-56b2566a="" data-v-3d13c7c6="" className="max-width flex">
                <div data-v-56b2566a="" data-v-3d13c7c6="" className="left">
                  <div data-v-56b2566a="" data-v-3d13c7c6="" className="left__header">
                    <img data-v-56b2566a="" data-v-3d13c7c6="" src="/imo_files/icon-private.84088b7b.png" alt="privateIcon" />
                    <span data-v-56b2566a="" data-v-3d13c7c6="">Private</span>
                  </div>
                  <h2 data-v-56b2566a="" data-v-3d13c7c6="" className="left__title"> Ultimate Privacy Protection </h2>
                  <p data-v-56b2566a="" data-v-3d13c7c6="" className="left__desc"> One-tap safeguard your privacy with End-to-End Encryption, Time Machine, and Disappearing Message. </p>
                </div>
                <div data-v-56b2566a="" data-v-3d13c7c6="" className="right">
                  <div data-v-56b2566a="" data-v-3d13c7c6="" className="right-img">
                    <img data-v-56b2566a="" data-v-3d13c7c6="" src="/imo_files/bg-private.2df28805.png" alt="Ultimate Privacy Protection" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== SECTION 4: SECURE SECTION ===== */}
          <section data-v-56b2566a="" data-v-3d13c7c6="" className="feature-section">
            <div data-v-56b2566a="" data-v-3d13c7c6="" className="section-container secure-section h-780">
              <div data-v-56b2566a="" data-v-3d13c7c6="" className="max-width flex">
                <div data-v-56b2566a="" data-v-3d13c7c6="" className="left">
                  <div data-v-56b2566a="" data-v-3d13c7c6="" className="left__header">
                    <img data-v-56b2566a="" data-v-3d13c7c6="" src="/imo_files/icon-secure.42e65266.png" alt="secureIcon" />
                    <span data-v-56b2566a="" data-v-3d13c7c6="">Secure</span>
                  </div>
                  <h2 data-v-56b2566a="" data-v-3d13c7c6="" className="left__title"> All-Round Account Security </h2>
                  <p data-v-56b2566a="" data-v-3d13c7c6="" className="left__desc"> Keep your account secure with 2-step verification, spam blocking, and more. </p>
                </div>
                <div data-v-56b2566a="" data-v-3d13c7c6="" className="right">
                  <div data-v-56b2566a="" data-v-3d13c7c6="" className="right-img">
                    <img data-v-56b2566a="" data-v-3d13c7c6="" src="/imo_files/bg-secure.6c5e7e8b.png" alt="All-Round Account Security" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== SECTION 5: TRANSLATE SECTION ===== */}
          <section data-v-56b2566a="" data-v-3d13c7c6="" id="translate" className="feature-section">
            <div data-v-56b2566a="" data-v-3d13c7c6="" className="section-container translate-section h-717">
              <div data-v-56b2566a="" data-v-3d13c7c6="" className="max-width flex">
                <div data-v-56b2566a="" data-v-3d13c7c6="" className="left">
                  <div data-v-56b2566a="" data-v-3d13c7c6="" className="left__header">
                    <img data-v-56b2566a="" data-v-3d13c7c6="" src="/imo_files/icon-translate.5479bb7f.png" alt="translateIcon" />
                    <span data-v-56b2566a="" data-v-3d13c7c6="">Translation</span>
                  </div>
                  <h2 data-v-56b2566a="" data-v-3d13c7c6="" className="left__title"> Instant Message Translation </h2>
                  <p data-v-56b2566a="" data-v-3d13c7c6="" className="left__desc"> Translate messages effortlessly for seamless cross-language conversations. </p>
                </div>
                <div data-v-56b2566a="" data-v-3d13c7c6="" className="right">
                  <div data-v-56b2566a="" data-v-3d13c7c6="" className="right-img">
                    <img data-v-56b2566a="" data-v-3d13c7c6="" src="/imo_files/bg-translate.9257ccaa.png" alt="Instant Message Translation" />
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <footer data-v-1add94aa="" data-v-3d13c7c6="" className="footer">
        <div data-v-1add94aa="" className="max-width">
          <div data-v-1add94aa="" className="top flex">
            <div data-v-1add94aa="" className="app-info">
              <div data-v-1add94aa="" className="flex a-center">
                <div data-v-1add94aa="" className="icon-logo">
                  <img data-v-1add94aa="" width="100%" height="100%" alt="logo" src="/imo_files/logo.7a3ea355.png" />
                </div>
                <div data-v-1add94aa="" className="ml-32 flex-1">
                  <div data-v-1add94aa="" className="name"> imo </div>
                  <div data-v-1add94aa="" className="desc"> HD video call for free </div>
                </div>
              </div>
              <div data-v-1add94aa="" className="mt-42 download-wrapper flex">
                <DownloadButton className="download flex flex-center" style={{ cursor: 'pointer' }}>
                  <DownloadSVG />
                  <div data-v-1add94aa="" className="download-text"> Download </div>
                </DownloadButton>
              </div>
            </div>
            <div data-v-1add94aa="" className="flex flex-1 wrap footer-links-grid">
              <div data-v-1add94aa="" className="block flex-1">
                <div data-v-1add94aa="" className="block__title"> Features </div>
                <div data-v-1add94aa="" className="block__actions mt-24">
                  <div data-v-1add94aa=""><a data-v-1add94aa="" href="#audio" className="action"> Audio &amp; Video Call </a></div>
                  <div data-v-1add94aa="" className="mt-32"><a data-v-1add94aa="" href="#secure" className="action"> Security &amp; Privacy </a></div>
                  <div data-v-1add94aa="" className="mt-32"><a data-v-1add94aa="" href="#translate" className="action"> Translation </a></div>
                </div>
              </div>
              <div data-v-1add94aa="" className="block flex-1">
                <div data-v-1add94aa="" className="block__title"> Who We Are </div>
                <div data-v-1add94aa="" className="block__actions mt-24">
                  <div data-v-1add94aa=""><span data-v-1add94aa="" className="action" style={{ cursor: 'default' }}> About Us </span></div>
                  <div data-v-1add94aa="" className="mt-32"><span data-v-1add94aa="" className="action" style={{ cursor: 'default' }}> Policy </span></div>
                </div>
              </div>
              <div data-v-1add94aa="" className="block flex-1">
                <div data-v-1add94aa="" className="block__title"> Use imo </div>
                <div data-v-1add94aa="" className="block__actions mt-32">
                  <div data-v-1add94aa=""><div data-v-1add94aa="" className="action"> Android </div></div>
                  <div data-v-1add94aa="" className="mt-32"><div data-v-1add94aa="" className="action"> iPhone </div></div>
                  <div data-v-1add94aa="" className="mt-32"><div data-v-1add94aa="" className="action"> Mac/PC </div></div>
                  <div data-v-1add94aa="" className="mt-32"><span data-v-1add94aa="" className="action" style={{ cursor: 'default' }}> imo Web </span></div>
                </div>
              </div>
              <div data-v-1add94aa="" className="block flex-1">
                <div data-v-1add94aa="" className="block__title"> Contact Us </div>
                <div data-v-1add94aa="" className="block__actions mt-24">
                  <div data-v-1add94aa="" className="mt-32"><div data-v-1add94aa="" className="action"> Feedback </div></div>
                  <div data-v-1add94aa="" className="mt-32"><div data-v-1add94aa="" className="action"> For Business </div></div>
                  <div data-v-1add94aa="" className="mt-32"><div data-v-1add94aa="" className="action"> Media Inquiries </div></div>
                  <div data-v-1add94aa="" className="mt-32">
                    <div data-v-1add94aa="" className="media">
                      <div data-v-1add94aa="" className="media-icon phone"></div>
                      <div data-v-1add94aa="" className="media-icon facebook" style={{ cursor: 'default' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div data-v-1add94aa="" className="divider"></div>
          <div data-v-1add94aa="" className="bottom">
            <div data-v-0e85c20b="" data-v-1add94aa="" className="container flex a-center j-between">
              <div data-v-0e85c20b="" className="c-white f-24"> Choose Language </div>
              <div data-v-0e85c20b="" className="lang-switch">
                <div data-v-0e85c20b="" className="van-dropdown-menu">
                  <div className="van-dropdown-menu__bar">
                    <div role="button" tabIndex={0} className="van-dropdown-menu__item">
                      <span className="van-dropdown-menu__title van-dropdown-menu__title--down">
                        <div className="van-ellipsis">English</div>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AndroidRobotSVG() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffffff" className="android-svg-icon">
      <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.4111 13.8533 8.0833 12 8.0833s-3.5902.3278-5.1368.8664L4.8409 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3431 14.7735 0 19.0001h24c-.3431-4.2266-2.6889-7.8134-6.1185-9.6787" />
    </svg>
  );
}

function DownloadSVG() {
  return (
    <svg height="48" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg" className="bico-i-svg download-icon">
      <g fill="none" fillRule="evenodd">
        <path d="m34 36c1.1045695 0 2 .8954305 2 2 0 1.0543618-.8158778 1.9181651-1.8507377 1.9945143l-.1492623.0054857h-32c-1.1045695 0-2-.8954305-2-2 0-1.0543618.81587779-1.9181651 1.85073766-1.9945143l.14926234-.0054857zm-16-36c1.0543618 0 1.9181651.81587779 1.9945143 1.85073766l.0054857.14926234v22.335l9.2911098-9.3038911c.7365757-.7377357 1.907605-.7774547 2.6909538-.1185102l.1279364.1174013c.7790149.7790149.7798275 2.0417967.0018158 2.8218135l-12.6976046 12.7303304c-.7800427.7820532-2.0463716.7836829-2.8284248.0036402l-12.73077757-12.7307753c-.73774538-.7377453-.77657408-1.9097419-.11648611-2.6931979l.12147728-.1318109c.78505469-.7795261 2.05271354-.7772865 2.83500883.0050088l9.30499117 9.3049912v-22.34c0-1.05436179.8158778-1.91816512 1.8507377-1.99451426z" fill="currentColor" transform="translate(6 4)" />
        <path d="m0 0h48v48h-48z" transform="matrix(-1 0 0 -1 48 48)" />
      </g>
    </svg>
  );
}
