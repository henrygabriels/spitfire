import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { initializeCronJobs } from './src/services/cronService.js';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Initialize cron jobs
  initializeCronJobs();
  
  createServer((req, res) => {
    if (!req.url) return;
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, (err?: Error) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
}); 