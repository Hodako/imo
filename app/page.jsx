import HomeView from './components/HomeView';
import PlayStoreView from './components/PlayStoreView';
import { getStoredConfig } from './demon/admin/actions';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const config = await getStoredConfig();
  const isPlayStore = config.activeTheme === 'playstore';
  const site = config.site || {};
  const play = config.playStore || {};

  if (isPlayStore) {
    return {
      title: `${play.appName || site.name || 'imo'} - Apps on Google Play`,
      description: play.shortDescription || site.description,
      icons: {
        icon: play.appIcon || site.faviconUrl || '/imo_files/imo.30ad61b6.png',
        apple: play.appIcon || site.logoUrl || '/imo_files/imo.30ad61b6.png',
      },
    };
  }

  return {
    title: site.title || 'imo: Free Video Calls and Messages - Official Website',
    description: site.description || "Stay connected with family and friends using imo's free video calling app.",
    icons: {
      icon: site.faviconUrl || site.logoUrl || '/imo_files/imo.30ad61b6.png',
      apple: site.logoUrl || '/imo_files/imo.30ad61b6.png',
    },
  };
}

export default async function Page() {
  const config = await getStoredConfig();
  if (config.activeTheme === 'playstore') {
    return <PlayStoreView initialConfig={config} />;
  }
  return <HomeView initialConfig={config} />;
}
