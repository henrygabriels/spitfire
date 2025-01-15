# Spitfire FPL API Documentation

Base URL: `https://web-production-79150.up.railway.app`

## Available Data

The service maintains an up-to-date SQLite database with the following tables:
- `gameweeks` - All 38 gameweeks and their status
- `teams` - All Premier League teams and their stats
- `players` - All FPL players and their detailed stats
- `element_types` - Player positions (GK, DEF, MID, FWD)
- `element_stats` - Statistical categories tracked
- `gameweek_status` - Live tracking of gameweek state

## Current Endpoints

### Get Gameweek Status

`GET /api/fpl/gameweek-status`

Returns the current gameweek status, including whether it's live and when it was last checked.

#### Response

```json
{
  "success": true,
  "data": {
    "isLive": boolean,
    "lastChecked": string // ISO timestamp
  }
}
```

#### Error Response

```json
{
  "success": false,
  "error": string
}
```

## Suggested Additional Endpoints

We can add these endpoints based on your frontend needs:

### Players
- `GET /api/fpl/players` - List all players
- `GET /api/fpl/players/:id` - Get specific player details
- `GET /api/fpl/players/team/:teamId` - Get players by team

### Teams
- `GET /api/fpl/teams` - List all teams
- `GET /api/fpl/teams/:id` - Get specific team details

### Gameweeks
- `GET /api/fpl/gameweeks` - List all gameweeks
- `GET /api/fpl/gameweeks/current` - Get current gameweek details

## Data Update Frequency

- During active gameweeks: Data is updated every minute
- Outside of gameweeks: Data is updated every 10 minutes

## Notes

- The service automatically polls the official FPL API and maintains an up-to-date SQLite database
- All timestamps are in ISO 8601 format
- The service automatically detects when a gameweek becomes active/inactive and adjusts its polling frequency accordingly
- The database schema matches the official FPL API structure with additional tracking for live updates

## Next Steps

1. Let us know which endpoints you need for your frontend
2. We can add new API endpoints to expose the required data
3. Each endpoint can include filtering, sorting, and pagination as needed 