import cron from 'node-cron';
import { fetchFPLBootstrapData } from '../utils/fpl.js';
import { db } from './db/index.js';

let isInitialized = false;
let liveUpdateJob: cron.ScheduledTask | null = null;

function logStatus(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
  if (data) console.log(JSON.stringify(data, null, 2));
}

async function checkGameweekStatus() {
  try {
    logStatus('🔄 Running gameweek status check');
    const data = await fetchFPLBootstrapData();
    
    // Update all data
    logStatus('📥 Updating database with fresh data');
    db.updateAllData(data);
    
    // Check if there's a current gameweek
    const hasCurrentGameweek = data.events.some(e => e.is_current);
    const currentGameweek = data.events.find(e => e.is_current);
    
    db.recordGameweekStatus(hasCurrentGameweek);
    
    // Manage live updates
    if (hasCurrentGameweek && !liveUpdateJob) {
      logStatus('🟢 Starting 1-minute polling', {
        reason: 'Current gameweek detected',
        gameweekId: currentGameweek?.id,
        pollInterval: '1 minute'
      });
      
      liveUpdateJob = cron.schedule('* * * * *', async () => {
        try {
          logStatus('📊 Minute update running');
          const liveData = await fetchFPLBootstrapData();
          db.updateAllData(liveData);
          logStatus('✅ Minute update completed');
        } catch (error) {
          logStatus('❌ Error in minute update:', error);
        }
      });
    } else if (!hasCurrentGameweek && liveUpdateJob) {
      logStatus('🔴 Stopping 1-minute polling', {
        reason: 'No current gameweek',
        pollInterval: '10 minutes'
      });
      liveUpdateJob.stop();
      liveUpdateJob = null;
    }
    
    logStatus('✅ Status check completed');
  } catch (error) {
    logStatus('❌ Error checking gameweek status:', error);
  }
}

export async function initializeCronJobs() {
  if (isInitialized) return;
  
  logStatus('🚀 Initializing cron jobs');
  
  // Run immediately on startup
  await checkGameweekStatus();
  
  // Then schedule regular checks
  cron.schedule('*/10 * * * *', checkGameweekStatus);
  
  isInitialized = true;
  logStatus('✅ Cron jobs initialized');
} 