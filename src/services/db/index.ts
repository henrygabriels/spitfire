import Database from 'better-sqlite3';
import { SCHEMA } from './schema.js';
import type { FPLGameweek, FPLTeam, FPLPlayer, FPLElementType, FPLElementStat } from '../../types/fpl.js';

interface GameweekStatus {
  is_live: boolean;
  checked_at: string;
}

class DBService {
  private static instance: DBService;
  private db: Database.Database;

  private constructor() {
    try {
      console.log('Initializing database...');
      console.log('Database path:', process.cwd() + '/fpl.db');
      
      this.db = new Database('fpl.db', {
        verbose: console.log
      });
      
      this.db.pragma('journal_mode = WAL');
      this.initialize();
      
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  public static getInstance(): DBService {
    if (!DBService.instance) {
      DBService.instance = new DBService();
    }
    return DBService.instance;
  }

  private initialize(): void {
    try {
      const statements = SCHEMA.split(';').filter(stmt => stmt.trim());
      for (const statement of statements) {
        this.db.prepare(statement).run();
      }
      console.log('Database schema initialized');
    } catch (error) {
      console.error('Error initializing database schema:', error);
      throw error;
    }
  }

  // Gameweek Status methods
  public recordGameweekStatus(isLive: boolean): void {
    try {
      console.log('Recording gameweek status:', { isLive });
      const stmt = this.db.prepare(`
        INSERT INTO gameweek_status (is_live)
        VALUES (?)
      `);
      stmt.run(isLive ? 1 : 0);
      console.log('Successfully recorded gameweek status');
    } catch (error) {
      console.error('Error recording gameweek status:', error);
      throw error;
    }
  }

  public getLatestStatus(): GameweekStatus | null {
    try {
      console.log('Fetching latest gameweek status');
      const stmt = this.db.prepare(`
        SELECT is_live, checked_at
        FROM gameweek_status
        ORDER BY checked_at DESC
        LIMIT 1
      `);
      const result = stmt.get() as GameweekStatus | null;
      console.log('Latest status result:', result);
      return result;
    } catch (error) {
      console.error('Error fetching latest status:', error);
      throw error;
    }
  }

  // Core data methods
  public upsertGameweek(gameweek: FPLGameweek): void {
    const stmt = this.db.prepare(`
      INSERT INTO gameweeks (
        id, name, deadline_time, average_entry_score, finished,
        data_checked, highest_scoring_entry, highest_score,
        is_previous, is_current, is_next, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        deadline_time = excluded.deadline_time,
        average_entry_score = excluded.average_entry_score,
        finished = excluded.finished,
        data_checked = excluded.data_checked,
        highest_scoring_entry = excluded.highest_scoring_entry,
        highest_score = excluded.highest_score,
        is_previous = excluded.is_previous,
        is_current = excluded.is_current,
        is_next = excluded.is_next,
        updated_at = CURRENT_TIMESTAMP
    `);

    stmt.run(
      gameweek.id,
      gameweek.name,
      gameweek.deadline_time,
      gameweek.average_entry_score,
      gameweek.finished ? 1 : 0,
      gameweek.data_checked ? 1 : 0,
      gameweek.highest_scoring_entry,
      gameweek.highest_score,
      gameweek.is_previous ? 1 : 0,
      gameweek.is_current ? 1 : 0,
      gameweek.is_next ? 1 : 0
    );
  }

  public upsertTeam(team: FPLTeam): void {
    const stmt = this.db.prepare(`
      INSERT INTO teams (
        id, code, name, short_name, strength, position, played,
        win, loss, draw, points, form, strength_overall_home,
        strength_overall_away, strength_attack_home, strength_attack_away,
        strength_defence_home, strength_defence_away, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        code = excluded.code,
        name = excluded.name,
        short_name = excluded.short_name,
        strength = excluded.strength,
        position = excluded.position,
        played = excluded.played,
        win = excluded.win,
        loss = excluded.loss,
        draw = excluded.draw,
        points = excluded.points,
        form = excluded.form,
        strength_overall_home = excluded.strength_overall_home,
        strength_overall_away = excluded.strength_overall_away,
        strength_attack_home = excluded.strength_attack_home,
        strength_attack_away = excluded.strength_attack_away,
        strength_defence_home = excluded.strength_defence_home,
        strength_defence_away = excluded.strength_defence_away,
        updated_at = CURRENT_TIMESTAMP
    `);

    stmt.run(
      team.id,
      team.code,
      team.name,
      team.short_name,
      team.strength,
      team.position,
      team.played,
      team.win,
      team.loss,
      team.draw,
      team.points,
      team.form,
      team.strength_overall_home,
      team.strength_overall_away,
      team.strength_attack_home,
      team.strength_attack_away,
      team.strength_defence_home,
      team.strength_defence_away
    );
  }

  public upsertElementType(elementType: FPLElementType): void {
    const stmt = this.db.prepare(`
      INSERT INTO element_types (
        id, plural_name, plural_name_short, singular_name,
        singular_name_short, squad_select, squad_min_play,
        squad_max_play, element_count, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        plural_name = excluded.plural_name,
        plural_name_short = excluded.plural_name_short,
        singular_name = excluded.singular_name,
        singular_name_short = excluded.singular_name_short,
        squad_select = excluded.squad_select,
        squad_min_play = excluded.squad_min_play,
        squad_max_play = excluded.squad_max_play,
        element_count = excluded.element_count,
        updated_at = CURRENT_TIMESTAMP
    `);

    stmt.run(
      elementType.id,
      elementType.plural_name,
      elementType.plural_name_short,
      elementType.singular_name,
      elementType.singular_name_short,
      elementType.squad_select,
      elementType.squad_min_play,
      elementType.squad_max_play,
      elementType.element_count
    );
  }

  public upsertElementStat(elementStat: FPLElementStat): void {
    const stmt = this.db.prepare(`
      INSERT INTO element_stats (
        name, label, abbreviation, is_match_specific, updated_at
      ) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(name) DO UPDATE SET
        label = excluded.label,
        abbreviation = excluded.abbreviation,
        is_match_specific = excluded.is_match_specific,
        updated_at = CURRENT_TIMESTAMP
    `);

    stmt.run(
      elementStat.name,
      elementStat.label,
      elementStat.abbreviation,
      elementStat.is_match_specific ? 1 : 0
    );
  }

  public upsertPlayer(player: FPLPlayer): void {
    const stmt = this.db.prepare(`
      INSERT INTO players (
        id, code, element_type, first_name, second_name, web_name,
        team, team_code, status, photo, chance_of_playing_next_round,
        chance_of_playing_this_round, cost_change_event,
        cost_change_event_fall, cost_change_start, cost_change_start_fall,
        dreamteam_count, event_points, form, in_dreamteam, news,
        news_added, now_cost, points_per_game, selected_by_percent,
        special, total_points, transfers_in, transfers_in_event,
        transfers_out, transfers_out_event, value_form, value_season,
        minutes, goals_scored, assists, clean_sheets, goals_conceded,
        own_goals, penalties_saved, penalties_missed, yellow_cards,
        red_cards, saves, bonus, bps, influence, creativity, threat,
        ict_index, starts, expected_goals, expected_assists,
        expected_goal_involvements, expected_goals_conceded,
        influence_rank, influence_rank_type, creativity_rank,
        creativity_rank_type, threat_rank, threat_rank_type,
        ict_index_rank, ict_index_rank_type,
        corners_and_indirect_freekicks_order,
        corners_and_indirect_freekicks_text,
        direct_freekicks_order, direct_freekicks_text,
        penalties_order, penalties_text, updated_at
      ) VALUES (${Array(69).fill('?').join(', ')}, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        code = excluded.code,
        element_type = excluded.element_type,
        first_name = excluded.first_name,
        second_name = excluded.second_name,
        web_name = excluded.web_name,
        team = excluded.team,
        team_code = excluded.team_code,
        status = excluded.status,
        photo = excluded.photo,
        chance_of_playing_next_round = excluded.chance_of_playing_next_round,
        chance_of_playing_this_round = excluded.chance_of_playing_this_round,
        cost_change_event = excluded.cost_change_event,
        cost_change_event_fall = excluded.cost_change_event_fall,
        cost_change_start = excluded.cost_change_start,
        cost_change_start_fall = excluded.cost_change_start_fall,
        dreamteam_count = excluded.dreamteam_count,
        event_points = excluded.event_points,
        form = excluded.form,
        in_dreamteam = excluded.in_dreamteam,
        news = excluded.news,
        news_added = excluded.news_added,
        now_cost = excluded.now_cost,
        points_per_game = excluded.points_per_game,
        selected_by_percent = excluded.selected_by_percent,
        special = excluded.special,
        total_points = excluded.total_points,
        transfers_in = excluded.transfers_in,
        transfers_in_event = excluded.transfers_in_event,
        transfers_out = excluded.transfers_out,
        transfers_out_event = excluded.transfers_out_event,
        value_form = excluded.value_form,
        value_season = excluded.value_season,
        minutes = excluded.minutes,
        goals_scored = excluded.goals_scored,
        assists = excluded.assists,
        clean_sheets = excluded.clean_sheets,
        goals_conceded = excluded.goals_conceded,
        own_goals = excluded.own_goals,
        penalties_saved = excluded.penalties_saved,
        penalties_missed = excluded.penalties_missed,
        yellow_cards = excluded.yellow_cards,
        red_cards = excluded.red_cards,
        saves = excluded.saves,
        bonus = excluded.bonus,
        bps = excluded.bps,
        influence = excluded.influence,
        creativity = excluded.creativity,
        threat = excluded.threat,
        ict_index = excluded.ict_index,
        starts = excluded.starts,
        expected_goals = excluded.expected_goals,
        expected_assists = excluded.expected_assists,
        expected_goal_involvements = excluded.expected_goal_involvements,
        expected_goals_conceded = excluded.expected_goals_conceded,
        influence_rank = excluded.influence_rank,
        influence_rank_type = excluded.influence_rank_type,
        creativity_rank = excluded.creativity_rank,
        creativity_rank_type = excluded.creativity_rank_type,
        threat_rank = excluded.threat_rank,
        threat_rank_type = excluded.threat_rank_type,
        ict_index_rank = excluded.ict_index_rank,
        ict_index_rank_type = excluded.ict_index_rank_type,
        corners_and_indirect_freekicks_order = excluded.corners_and_indirect_freekicks_order,
        corners_and_indirect_freekicks_text = excluded.corners_and_indirect_freekicks_text,
        direct_freekicks_order = excluded.direct_freekicks_order,
        direct_freekicks_text = excluded.direct_freekicks_text,
        penalties_order = excluded.penalties_order,
        penalties_text = excluded.penalties_text,
        updated_at = CURRENT_TIMESTAMP
    `);

    stmt.run(
      player.id,
      player.code,
      player.element_type,
      player.first_name,
      player.second_name,
      player.web_name,
      player.team,
      player.team_code,
      player.status,
      player.photo,
      player.chance_of_playing_next_round,
      player.chance_of_playing_this_round,
      player.cost_change_event,
      player.cost_change_event_fall,
      player.cost_change_start,
      player.cost_change_start_fall,
      player.dreamteam_count,
      player.event_points,
      player.form,
      player.in_dreamteam ? 1 : 0,
      player.news,
      player.news_added,
      player.now_cost,
      player.points_per_game,
      player.selected_by_percent,
      player.special ? 1 : 0,
      player.total_points,
      player.transfers_in,
      player.transfers_in_event,
      player.transfers_out,
      player.transfers_out_event,
      player.value_form,
      player.value_season,
      player.minutes,
      player.goals_scored,
      player.assists,
      player.clean_sheets,
      player.goals_conceded,
      player.own_goals,
      player.penalties_saved,
      player.penalties_missed,
      player.yellow_cards,
      player.red_cards,
      player.saves,
      player.bonus,
      player.bps,
      player.influence,
      player.creativity,
      player.threat,
      player.ict_index,
      player.starts,
      player.expected_goals,
      player.expected_assists,
      player.expected_goal_involvements,
      player.expected_goals_conceded,
      player.influence_rank,
      player.influence_rank_type,
      player.creativity_rank,
      player.creativity_rank_type,
      player.threat_rank,
      player.threat_rank_type,
      player.ict_index_rank,
      player.ict_index_rank_type,
      player.corners_and_indirect_freekicks_order,
      player.corners_and_indirect_freekicks_text,
      player.direct_freekicks_order,
      player.direct_freekicks_text,
      player.penalties_order,
      player.penalties_text
    );
  }

  // Batch update methods
  public updateAllData(data: {
    events: FPLGameweek[];
    teams: FPLTeam[];
    elements: FPLPlayer[];
    element_types: FPLElementType[];
    element_stats: FPLElementStat[];
  }): void {
    this.db.transaction(() => {
      // Update in order of dependencies
      data.element_types.forEach(et => this.upsertElementType(et));
      data.element_stats.forEach(es => this.upsertElementStat(es));
      data.teams.forEach(t => this.upsertTeam(t));
      data.events.forEach(e => this.upsertGameweek(e));
      data.elements.forEach(e => this.upsertPlayer(e));
    })();
  }

  getCurrentGameweek() {
    return this.db.prepare(`
      SELECT * FROM gameweeks 
      WHERE is_current = 1 
      LIMIT 1
    `).get();
  }

  public getGameweekStatus() {
    try {
      console.log('Fetching comprehensive gameweek status');
      
      // Get the current gameweek
      const currentGameweek = this.db.prepare(`
        SELECT id, name, deadline_time, finished, is_current
        FROM gameweeks 
        WHERE is_current = 1 
        LIMIT 1
      `).get();

      // Get the latest status
      const latestStatus = this.db.prepare(`
        SELECT is_live, checked_at
        FROM gameweek_status
        ORDER BY checked_at DESC
        LIMIT 1
      `).get();

      console.log('Status check results:', { currentGameweek, latestStatus });
      
      return {
        currentGameweek,
        isLive: latestStatus?.is_live ?? false,
        lastChecked: latestStatus?.checked_at ?? new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching gameweek status:', error);
      throw error;
    }
  }
}

export const db = DBService.getInstance(); 