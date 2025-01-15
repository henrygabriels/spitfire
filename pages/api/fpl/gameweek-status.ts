import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../src/services/db/index.js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const status = db.getLatestStatus();
    if (!status) {
      return res.status(404).json({ error: 'No status found' });
    }

    res.status(200).json(status);
  } catch (error) {
    console.error('Error fetching gameweek status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 