import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { initializeCronJobs } from './src/services/cronService.js';

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev });
const handle = app.getRequestHandler();

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

app.prepare().then(async () => {
  try {
    console.log('Starting server initialization...');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Working Directory:', process.cwd());
    
    // Initialize cron jobs
    console.log('Initializing cron jobs...');
    await initializeCronJobs().catch(error => {
      console.error('Failed to initialize cron jobs:', error);
      throw error;
    });
    console.log('Cron jobs initialized successfully');
    
    createServer(async (req, res) => {
      try {
        if (!req.url) return;
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Error handling request:', err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    }).listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
  } catch (err) {
    console.error('Error during server initialization:', err);
    process.exit(1);
  }
}); 