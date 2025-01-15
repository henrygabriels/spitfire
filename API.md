# Spitfire FPL API Documentation

Base URL: `https://web-production-79150.up.railway.app`

## Endpoints

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

## Data Update Frequency

- During active gameweeks: Data is updated every minute
- Outside of gameweeks: Data is updated every 10 minutes

## Notes

- The service automatically polls the official FPL API and maintains an up-to-date SQLite database
- All timestamps are in ISO 8601 format
- The service automatically detects when a gameweek becomes active/inactive and adjusts its polling frequency accordingly 