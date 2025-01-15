import { NextResponse } from 'next/server';
import { db } from '../../../../services/db/index.js';

export async function GET() {
  try {
    const status = db.getLatestStatus();

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'No status data available' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        isLive: status.is_live,
        lastChecked: status.checked_at,
      }
    });
  } catch (error) {
    console.error('Error in gameweek-status API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gameweek status' },
      { status: 500 }
    );
  }
} 