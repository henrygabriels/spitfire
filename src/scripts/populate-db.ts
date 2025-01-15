import { fetchFPLBootstrapData } from '../utils/fpl.js';
import { db } from '../services/db/index.js';

async function populateDatabase() {
  try {
    console.log('Fetching FPL bootstrap data...');
    const data = await fetchFPLBootstrapData();
    
    console.log('Updating database...');
    db.updateAllData(data);
    
    // Set initial gameweek status
    const currentGameweek = data.events.find(e => e.is_current);
    if (currentGameweek) {
      const isLive = !currentGameweek.finished && 
        new Date(currentGameweek.deadline_time) <= new Date();
      db.recordGameweekStatus(isLive);
    }
    
    console.log('Database populated successfully!');
    console.log('\nData Overview:');
    console.log('-------------');
    console.log(`Gameweeks: ${data.events.length}`);
    console.log(`Teams: ${data.teams.length}`);
    console.log(`Players: ${data.elements.length}`);
    console.log(`Element Types: ${data.element_types.length}`);
    console.log(`Element Stats: ${data.element_stats.length}`);
    
  } catch (error) {
    console.error('Error populating database:', error);
    process.exit(1);
  }
}

// Run the script
populateDatabase(); 