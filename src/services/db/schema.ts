export const SCHEMA = `
-- Core tables
CREATE TABLE IF NOT EXISTS gameweek_status (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  is_live BOOLEAN NOT NULL,
  checked_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gameweeks (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  deadline_time DATETIME NOT NULL,
  average_entry_score INTEGER,
  finished BOOLEAN NOT NULL,
  data_checked BOOLEAN NOT NULL,
  highest_scoring_entry INTEGER,
  highest_score INTEGER,
  is_previous BOOLEAN NOT NULL,
  is_current BOOLEAN NOT NULL,
  is_next BOOLEAN NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS teams (
  id INTEGER PRIMARY KEY,
  code INTEGER NOT NULL,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  strength INTEGER NOT NULL,
  position INTEGER,
  played INTEGER NOT NULL DEFAULT 0,
  win INTEGER NOT NULL DEFAULT 0,
  loss INTEGER NOT NULL DEFAULT 0,
  draw INTEGER NOT NULL DEFAULT 0,
  points INTEGER NOT NULL DEFAULT 0,
  form TEXT,
  strength_overall_home INTEGER NOT NULL,
  strength_overall_away INTEGER NOT NULL,
  strength_attack_home INTEGER NOT NULL,
  strength_attack_away INTEGER NOT NULL,
  strength_defence_home INTEGER NOT NULL,
  strength_defence_away INTEGER NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS element_types (
  id INTEGER PRIMARY KEY,
  plural_name TEXT NOT NULL,
  plural_name_short TEXT NOT NULL,
  singular_name TEXT NOT NULL,
  singular_name_short TEXT NOT NULL,
  squad_select INTEGER NOT NULL,
  squad_min_play INTEGER NOT NULL,
  squad_max_play INTEGER NOT NULL,
  element_count INTEGER NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS element_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  abbreviation TEXT,
  is_match_specific BOOLEAN NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Players table (67 columns total)
CREATE TABLE IF NOT EXISTS players (
  id INTEGER PRIMARY KEY,                                    -- 1
  code INTEGER NOT NULL,                                    -- 2
  element_type INTEGER NOT NULL,                            -- 3
  first_name TEXT NOT NULL,                                 -- 4
  second_name TEXT NOT NULL,                                -- 5
  web_name TEXT NOT NULL,                                   -- 6
  team INTEGER NOT NULL,                                    -- 7
  team_code INTEGER NOT NULL,                               -- 8
  status TEXT NOT NULL,                                     -- 9
  photo TEXT NOT NULL,                                      -- 10
  chance_of_playing_next_round INTEGER,                     -- 11
  chance_of_playing_this_round INTEGER,                     -- 12
  cost_change_event INTEGER NOT NULL,                       -- 13
  cost_change_event_fall INTEGER NOT NULL,                  -- 14
  cost_change_start INTEGER NOT NULL,                       -- 15
  cost_change_start_fall INTEGER NOT NULL,                  -- 16
  dreamteam_count INTEGER NOT NULL,                         -- 17
  event_points INTEGER NOT NULL,                            -- 18
  form TEXT NOT NULL,                                       -- 19
  in_dreamteam BOOLEAN NOT NULL,                           -- 20
  news TEXT,                                               -- 21
  news_added DATETIME,                                     -- 22
  now_cost INTEGER NOT NULL,                               -- 23
  points_per_game TEXT NOT NULL,                           -- 24
  selected_by_percent TEXT NOT NULL,                       -- 25
  special BOOLEAN NOT NULL,                                -- 26
  total_points INTEGER NOT NULL,                           -- 27
  transfers_in INTEGER NOT NULL,                           -- 28
  transfers_in_event INTEGER NOT NULL,                     -- 29
  transfers_out INTEGER NOT NULL,                          -- 30
  transfers_out_event INTEGER NOT NULL,                    -- 31
  value_form TEXT NOT NULL,                                -- 32
  value_season TEXT NOT NULL,                              -- 33
  minutes INTEGER NOT NULL,                                -- 34
  goals_scored INTEGER NOT NULL,                           -- 35
  assists INTEGER NOT NULL,                                -- 36
  clean_sheets INTEGER NOT NULL,                           -- 37
  goals_conceded INTEGER NOT NULL,                         -- 38
  own_goals INTEGER NOT NULL,                              -- 39
  penalties_saved INTEGER NOT NULL,                        -- 40
  penalties_missed INTEGER NOT NULL,                       -- 41
  yellow_cards INTEGER NOT NULL,                           -- 42
  red_cards INTEGER NOT NULL,                              -- 43
  saves INTEGER NOT NULL,                                  -- 44
  bonus INTEGER NOT NULL,                                  -- 45
  bps INTEGER NOT NULL,                                    -- 46
  influence TEXT NOT NULL,                                 -- 47
  creativity TEXT NOT NULL,                                -- 48
  threat TEXT NOT NULL,                                    -- 49
  ict_index TEXT NOT NULL,                                 -- 50
  starts INTEGER NOT NULL,                                 -- 51
  expected_goals TEXT NOT NULL,                            -- 52
  expected_assists TEXT NOT NULL,                          -- 53
  expected_goal_involvements TEXT NOT NULL,                -- 54
  expected_goals_conceded TEXT NOT NULL,                   -- 55
  influence_rank INTEGER NOT NULL,                         -- 56
  influence_rank_type INTEGER NOT NULL,                    -- 57
  creativity_rank INTEGER NOT NULL,                        -- 58
  creativity_rank_type INTEGER NOT NULL,                   -- 59
  threat_rank INTEGER NOT NULL,                            -- 60
  threat_rank_type INTEGER NOT NULL,                       -- 61
  ict_index_rank INTEGER NOT NULL,                         -- 62
  ict_index_rank_type INTEGER NOT NULL,                    -- 63
  corners_and_indirect_freekicks_order INTEGER,            -- 64
  corners_and_indirect_freekicks_text TEXT NOT NULL,       -- 65
  direct_freekicks_order INTEGER,                          -- 66
  direct_freekicks_text TEXT NOT NULL,                     -- 67
  penalties_order INTEGER,                                 -- 68
  penalties_text TEXT NOT NULL,                            -- 69
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP   -- 70
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_status_timestamp ON gameweek_status(checked_at);
CREATE INDEX IF NOT EXISTS idx_gameweeks_current ON gameweeks(is_current);
CREATE INDEX IF NOT EXISTS idx_gameweeks_finished ON gameweeks(finished);
CREATE INDEX IF NOT EXISTS idx_players_team ON players(team);
CREATE INDEX IF NOT EXISTS idx_players_element_type ON players(element_type);
CREATE INDEX IF NOT EXISTS idx_players_form ON players(form);
CREATE INDEX IF NOT EXISTS idx_players_total_points ON players(total_points);
CREATE INDEX IF NOT EXISTS idx_players_minutes ON players(minutes);
CREATE INDEX IF NOT EXISTS idx_players_goals ON players(goals_scored);
CREATE INDEX IF NOT EXISTS idx_players_assists ON players(assists);
`; 