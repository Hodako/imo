import { NextResponse } from 'next/server';
import { getStoredConfig, saveStoredConfig } from '@/app/demon/admin/actions';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const config = await getStoredConfig();
    return NextResponse.json({ success: true, config });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const isAuthed = cookieStore.get('imo_admin_session')?.value === 'true';
    if (!isAuthed) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const existing = await getStoredConfig();
    const updated = {
      ...existing,
      ...body,
      // Preserve admin password unless explicitly updated via password action
      adminPassword: existing.adminPassword,
    };

    await saveStoredConfig(updated);
    return NextResponse.json({ success: true, config: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
