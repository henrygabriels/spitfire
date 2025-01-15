import { NextResponse } from 'next/server';
import { db } from '../../../../services/db/index.js';

interface GameweekData {
  id: number;
  name: string;
  deadline_time: string;
  finished: number;
  is_current: number;
}

export async function GET() {
  try {
    // Get current gameweek info
    const currentGameweek = db.getCurrentGameweek() as GameweekData | undefined;
    
    // Get latest status
    const latestStatus = db.getLatestStatus();

    // If we have no data at all yet
    if (!currentGameweek && !latestStatus) {
      console.log('No gameweek or status data found, initializing...');
      db.recordGameweekStatus(false);
      return NextResponse.json({
        success: true,
        data: {
          isLive: false,
          lastChecked: new Date().toISOString(),
          note: 'Initial status - waiting for first update'
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        currentGameweek: currentGameweek ? {
          id: currentGameweek.id,
          name: currentGameweek.name,
          deadlineTime: currentGameweek.deadline_time,
          finished: Boolean(currentGameweek.finished)
        } : null,
        isLive: Boolean(latestStatus?.is_live),
        lastChecked: latestStatus?.checked_at ?? new Date().toISOString()
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