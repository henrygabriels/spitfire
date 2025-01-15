import { fetchFPLBootstrapData } from '../utils/fpl.js';
import fs from 'fs/promises';
import path from 'path';

async function fetchAndSaveData() {
  try {
    console.log('Fetching FPL bootstrap data...');
    const data = await fetchFPLBootstrapData();
    
    // Create data directory if it doesn't exist
    await fs.mkdir('data', { recursive: true });
    
    // Save the full response with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `data/fpl-bootstrap-${timestamp}.json`;
    
    await fs.writeFile(
      filename,
      JSON.stringify(data, null, 2)
    );
    
    console.log(`Data saved to ${filename}`);
    
    // Log some basic stats
    console.log('\nData Overview:');
    console.log('-------------');
    console.log(`Total Events (Gameweeks): ${data.events.length}`);
    console.log(`Total Teams: ${data.teams.length}`);
    console.log(`Total Players: ${data.elements.length}`);
    console.log(`Total Player Stats Tracked: ${Object.keys(data.element_stats).length}`);
    console.log(`Total Element Types: ${data.element_types.length}`);
    
    // Log current gameweek info
    const currentGameweek = data.events.find(e => e.is_current);
    if (currentGameweek) {
      console.log('\nCurrent Gameweek:');
      console.log('----------------');
      console.log(`ID: ${currentGameweek.id}`);
      console.log(`Name: ${currentGameweek.name}`);
      console.log(`Deadline: ${currentGameweek.deadline_time}`);
      console.log(`Finished: ${currentGameweek.finished}`);
    }
    
  } catch (error) {
    console.error('Error fetching data:', error);
    process.exit(1);
  }
}

// Run the script
fetchAndSaveData(); 