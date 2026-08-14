import { cookies } from 'next/headers';
import AdminDashboard from './AdminDashboard';
import AdminLoginForm from './AdminLoginForm';
import { getStoredConfig } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminPage({ searchParams }) {
  const config = await getStoredConfig();
  const cookieStore = await cookies();

  // 1. Direct passcode in query params (e.g. /demon/admin?pass=admin123)
  const sp = await Promise.resolve(searchParams || {});
  const isAuthedByQuery = sp?.pass && sp.pass === (config.adminPassword || 'admin123');

  // 2. Session cookie check
  const sessionVal = cookieStore.get('imo_admin_session')?.value;
  const isAuthed = Boolean(isAuthedByQuery || sessionVal === 'true');

  if (isAuthed) {
    return <AdminDashboard initialConfig={config} isQueryAuth={Boolean(isAuthedByQuery)} />;
  }

  return <AdminLoginForm />;
}
