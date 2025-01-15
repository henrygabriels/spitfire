# Spitfire FPL

A real-time Fantasy Premier League (FPL) data service that automatically tracks gameweek status and player updates.

## Features

- 🔄 Automatic polling of the official FPL API
- ⚡ Real-time updates during active gameweeks (1-minute intervals)
- 📊 SQLite database for reliable data storage
- 🎯 Smart polling strategy:
  - Every minute during active gameweeks
  - Every 10 minutes during non-active periods
- 🌐 Next.js API endpoints for data access

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/spitfire.git
cd spitfire
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`.

### Database Setup

The database will be automatically created and populated when you first run the server. If you need to manually populate the database:

```bash
npm run populate-db
```

## API Endpoints

### GET `/api/fpl/gameweek-status`

Returns the current gameweek status:

```json
{
  "success": true,
  "data": {
    "isLive": boolean,
    "lastChecked": string
  }
}
```

## Development

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run fetch-fpl` - Manually fetch latest FPL data
- `npm run populate-db` - Populate/update the database

## License

MIT

## Acknowledgments

- [Official Fantasy Premier League](https://fantasy.premierleague.com/)
- Built with Next.js, TypeScript, and SQLite
