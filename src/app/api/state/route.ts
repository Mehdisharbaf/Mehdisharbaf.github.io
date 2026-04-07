import { NextResponse } from 'next/server';
import { getAppState, updatePrinterStatus, PrinterStatus } from '@/lib/store';

// Prevent caching to ensure fresh data
export const dynamic = 'force-dynamic';

export async function GET() {
  const state = getAppState();

  // Calculate uptime
  const uptimeSeconds = Math.floor((Date.now() - state.serverStartTime) / 1000);
  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = uptimeSeconds % 60;

  const uptimeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return NextResponse.json({
    uptime: uptimeStr,
    printerStatus: state.printerStatus,
    jobs: state.jobs,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { status } = body as { status: PrinterStatus };

    if (status !== 'online' && status !== 'offline') {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    updatePrinterStatus(status);

    return NextResponse.json({ success: true, status });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
