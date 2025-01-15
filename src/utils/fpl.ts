import axios from 'axios';
import { FPLBootstrapResponse } from '../types/fpl.js';

const FPL_BASE_URL = 'https://fantasy.premierleague.com/api';

export async function fetchFPLBootstrapData(): Promise<FPLBootstrapResponse> {
  try {
    const response = await axios.get<FPLBootstrapResponse>(`${FPL_BASE_URL}/bootstrap-static/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching FPL data:', error);
    throw error;
  }
}

export function getCurrentGameweek(bootstrapData: FPLBootstrapResponse): number | null {
  const currentGameweek = bootstrapData.events.find(event => event.is_current);
  return currentGameweek?.id ?? null;
}

export function isGameweekActive(bootstrapData: FPLBootstrapResponse): boolean {
  const currentGameweek = bootstrapData.events.find(event => event.is_current);
  if (!currentGameweek) return false;
  
  const now = Date.now();
  const deadlineTime = new Date(currentGameweek.deadline_time).getTime();
  
  return now >= deadlineTime && !currentGameweek.finished;
} 