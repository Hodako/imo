'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';

const SITE_CONFIG_PATH = path.join(process.cwd(), 'data', 'site-config.json');
const APK_CONFIG_PATH = path.join(process.cwd(), 'data', 'apk-config.json');
const DEFAULT_PASSWORD = 'admin123';

const DEFAULT_CONFIG = {
  adminPassword: DEFAULT_PASSWORD,
  site: {
    title: 'imo - Free Video Calls and Chat',
    name: 'imo',
    description: 'imo is a free, simple, and secure video calling and instant messaging app.',
    logoUrl: '/imo_files/imo.30ad61b6.png',
    faviconUrl: '/imo_files/imo.30ad61b6.png',
  },
  hero: {
    title: 'Free, Simple,\nand Secure',
    subtitle: 'Connect with your loved ones through calls and messages.',
    downloadBtnText: 'Download Now',
    moreVersionsText: 'More Versions >',
    artworkImage: '/imo_files/bg-home-first-image.842b02fa.png',
    bgImage: '/cdn-assets-s/imo-official/img/bg-top.cd690b6a.png',
  },
  sections: {
    section1: {
      id: 'audio',
      badgeText: 'Audio & Video',
      badgeIcon: '/imo_files/icon-video-light.d5af9c91.png',
      title: 'Free, Secure, HD Calls',
      desc: 'Crystal-clear calls for all connections, regardless of network.',
      image: '/imo_files/bg-video-call.6259fb3f.png',
    },
    section2: {
      id: 'global',
      badgeText: 'Global Call',
      badgeIcon: '/imo_files/icon-video-dark.229c7d5c.png',
      title: 'Free International Calls',
      desc: 'Connect with anyone, anywhere in the world, on any network with low cost or free.',
      image: '/imo_files/global-call.a744bcae.png',
    },
    section3: {
      id: 'private',
      badgeText: 'Privacy',
      badgeIcon: '/imo_files/icon-private.84088b7b.png',
      title: 'Private Call',
      desc: 'Enjoy completely private chats and calls with built-in end-to-end encryption.',
      image: '/imo_files/bg-private.2df28805.png',
    },
    section4: {
      id: 'secure',
      badgeText: 'Security',
      badgeIcon: '/imo_files/icon-secure.42e65266.png',
      title: 'Secure Communication',
      desc: 'End-to-end encrypted messaging to keep all your personal messages confidential.',
      image: '/imo_files/bg-secure.6c5e7e8b.png',
    },
    section5: {
      id: 'translate',
      badgeText: 'Translation',
      badgeIcon: '/imo_files/icon-translate.5479bb7f.png',
      title: 'Instant Message Translation',
      desc: 'Translate messages effortlessly for seamless cross-language conversations.',
      image: '/imo_files/bg-translate.9257ccaa.png',
    },
  },
  links: {
    homeUrl: '/',
    blogUrl: '',
    helpCenterUrl: '',
    appsUrl: '',
    imoWebUrl: '',
    aboutUsUrl: '',
    policyUrl: '',
    facebookUrl: '',
  },
  apk: {
    apkUrl: '',
  },
};

export async function getAdminPath() {
  try {
    const pkgPath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      if (pkg.adminPath) {
        return pkg.adminPath.replace(/^\/+|\/+$/g, '');
      }
    }
  } catch {
    // ignore
  }
  return 'demon/admin';
}

async function revalidateAdminPaths() {
  const customPath = await getAdminPath();
  revalidatePath('/demon/admin');
  if (customPath && customPath !== 'demon/admin') {
    revalidatePath(`/${customPath}`);
  }
  revalidatePath('/');
}

export async function getStoredConfig() {
  const dir = path.dirname(SITE_CONFIG_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  let config = { ...DEFAULT_CONFIG };

  if (fs.existsSync(SITE_CONFIG_PATH)) {
    try {
      const raw = fs.readFileSync(SITE_CONFIG_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      config = {
        ...DEFAULT_CONFIG,
        ...parsed,
        site: { ...DEFAULT_CONFIG.site, ...(parsed.site || {}) },
        hero: { ...DEFAULT_CONFIG.hero, ...(parsed.hero || {}) },
        sections: {
          section1: { ...DEFAULT_CONFIG.sections.section1, ...(parsed.sections?.section1 || {}) },
          section2: { ...DEFAULT_CONFIG.sections.section2, ...(parsed.sections?.section2 || {}) },
          section3: { ...DEFAULT_CONFIG.sections.section3, ...(parsed.sections?.section3 || {}) },
          section4: { ...DEFAULT_CONFIG.sections.section4, ...(parsed.sections?.section4 || {}) },
          section5: { ...DEFAULT_CONFIG.sections.section5, ...(parsed.sections?.section5 || {}) },
        },
        links: { ...DEFAULT_CONFIG.links, ...(parsed.links || {}) },
        apk: { ...DEFAULT_CONFIG.apk, ...(parsed.apk || {}) },
      };
    } catch {
      // fallback
    }
  } else if (fs.existsSync(APK_CONFIG_PATH)) {
    try {
      const legacyRaw = fs.readFileSync(APK_CONFIG_PATH, 'utf-8');
      const legacy = JSON.parse(legacyRaw);
      if (legacy.apkUrl) config.apk.apkUrl = legacy.apkUrl;
      if (legacy.adminPassword) config.adminPassword = legacy.adminPassword;
    } catch {
      // fallback
    }
    fs.writeFileSync(SITE_CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
  }

  // Ensure apkUrl is also available on root level for legacy components
  config.apkUrl = config.apk?.apkUrl || '';
  return config;
}

export async function saveStoredConfig(data) {
  const dir = path.dirname(SITE_CONFIG_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(SITE_CONFIG_PATH, JSON.stringify(data, null, 2), 'utf-8');

  // Also sync legacy apk-config.json
  try {
    const legacy = {
      apkUrl: data.apk?.apkUrl || data.apkUrl || '',
      adminPassword: data.adminPassword || DEFAULT_PASSWORD,
    };
    fs.writeFileSync(APK_CONFIG_PATH, JSON.stringify(legacy, null, 2), 'utf-8');
  } catch {
    // ignore
  }

  await revalidateAdminPaths();
}

export async function loginAdmin(prevState, formData) {
  try {
    let password = '';
    if (formData instanceof FormData) {
      password = formData.get('password') || '';
    } else if (typeof formData === 'string') {
      password = formData;
    } else if (formData && typeof formData === 'object') {
      password = formData.password || '';
    }

    const config = await getStoredConfig();
    const correctPassword = config.adminPassword || DEFAULT_PASSWORD;

    if (password.trim() === correctPassword) {
      const cookieStore = await cookies();
      cookieStore.set('imo_admin_session', 'true', {
        httpOnly: false,
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: 'lax',
      });
      await revalidateAdminPaths();
      return { success: true };
    } else {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }
  } catch (err) {
    return { success: false, error: err.message || 'Login failed' };
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('imo_admin_session');
  cookieStore.set('imo_admin_session', '', {
    path: '/',
    maxAge: 0,
  });
  await revalidateAdminPaths();
  return { success: true };
}

export async function saveSiteConfigAction(updatedPartial) {
  const cookieStore = await cookies();
  const isAuthed = cookieStore.get('imo_admin_session')?.value === 'true';
  if (!isAuthed) return { success: false, error: 'Unauthorized' };

  const current = await getStoredConfig();
  const merged = {
    ...current,
    ...updatedPartial,
    adminPassword: current.adminPassword, // keep password safe
  };

  await saveStoredConfig(merged);
  return { success: true, config: merged };
}

export async function saveApkUrlAction(newUrl) {
  const cookieStore = await cookies();
  const isAuthed = cookieStore.get('imo_admin_session')?.value === 'true';
  if (!isAuthed) return { success: false, error: 'Unauthorized' };

  const config = await getStoredConfig();
  config.apk = config.apk || {};
  config.apk.apkUrl = (newUrl || '').trim();
  config.apkUrl = config.apk.apkUrl;

  await saveStoredConfig(config);
  return { success: true, apkUrl: config.apk.apkUrl };
}

export async function changePasswordAction(currentPassword, newPassword) {
  const cookieStore = await cookies();
  const isAuthed = cookieStore.get('imo_admin_session')?.value === 'true';
  if (!isAuthed) return { success: false, error: 'Unauthorized' };

  const config = await getStoredConfig();
  const correctPassword = config.adminPassword || DEFAULT_PASSWORD;

  if (currentPassword !== correctPassword) {
    return { success: false, error: 'Current password is incorrect' };
  }
  if (!newPassword || newPassword.length < 4) {
    return { success: false, error: 'New password must be at least 4 characters long' };
  }

  config.adminPassword = newPassword;
  await saveStoredConfig(config);
  return { success: true, message: 'Password updated successfully!' };
}
