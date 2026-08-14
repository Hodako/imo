import HomeView from './components/HomeView';
import { getStoredConfig } from './demon/admin/actions';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const config = await getStoredConfig();
  const site = config.site || {};
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
  return <HomeView initialConfig={config} />;
}
