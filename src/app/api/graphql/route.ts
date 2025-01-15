import { createSchema, createYoga } from \"graphql-yoga\";
import { db } from \"../../../services/db/index.js\";

const typeDefs = `
  type Query {
    gameweekStatus: GameweekStatus!
    currentGameweek: Gameweek
    gameweeks: [Gameweek!]!
    teams: [Team!]!
    players: [Player!]!
  }

  type GameweekStatus {
    isLive: Boolean!
    lastChecked: String!
    currentGameweek: Gameweek
  }

  type Gameweek {
    id: Int!
    name: String!
    deadlineTime: String!
    finished: Boolean!
    isCurrent: Boolean!
    isPrevious: Boolean!
    isNext: Boolean!
    averageEntryScore: Int
    highestScore: Int
    dataChecked: Boolean!
  }

  type Team {
    id: Int!
    name: String!
    shortName: String!
    strength: Int!
    position: Int!
    played: Int!
    points: Int!
    form: String
  }

  type Player {
    id: Int!
    code: Int!
    elementType: Int!
    firstName: String!
    secondName: String!
    webName: String!
    team: Int!
    status: String!
    form: String
    totalPoints: Int!
    eventPoints: Int!
    selectedByPercent: String!
    nowCost: Int!
  }
`;

const resolvers = {
  Query: {
    gameweekStatus: () => {
      const status = db.getLatestStatus();
      const currentGameweek = db.getCurrentGameweek();
      return {
        isLive: status?.is_live ?? false,
        lastChecked: status?.checked_at ?? new Date().toISOString(),
        currentGameweek: currentGameweek ? {
          id: currentGameweek.id,
          name: currentGameweek.name,
          deadlineTime: currentGameweek.deadline_time,
          finished: Boolean(currentGameweek.finished),
          isCurrent: Boolean(currentGameweek.is_current),
          isPrevious: Boolean(currentGameweek.is_previous),
          isNext: Boolean(currentGameweek.is_next),
          averageEntryScore: currentGameweek.average_entry_score,
          highestScore: currentGameweek.highest_score,
          dataChecked: Boolean(currentGameweek.data_checked)
        } : null
      };
    },
    currentGameweek: () => {
      const gameweek = db.getCurrentGameweek();
      return gameweek ? {
        id: gameweek.id,
        name: gameweek.name,
        deadlineTime: gameweek.deadline_time,
        finished: Boolean(gameweek.finished),
        isCurrent: Boolean(gameweek.is_current),
        isPrevious: Boolean(gameweek.is_previous),
        isNext: Boolean(gameweek.is_next),
        averageEntryScore: gameweek.average_entry_score,
        highestScore: gameweek.highest_score,
        dataChecked: Boolean(gameweek.data_checked)
      } : null;
    },
    gameweeks: () => {
      const gameweeks = db.prepare(\"SELECT * FROM gameweeks\").all();
      return gameweeks.map(gw => ({
        id: gw.id,
        name: gw.name,
        deadlineTime: gw.deadline_time,
        finished: Boolean(gw.finished),
        isCurrent: Boolean(gw.is_current),
        isPrevious: Boolean(gw.is_previous),
        isNext: Boolean(gw.is_next),
        averageEntryScore: gw.average_entry_score,
        highestScore: gw.highest_score,
        dataChecked: Boolean(gw.data_checked)
      }));
    },
    teams: () => {
      const teams = db.prepare(\"SELECT * FROM teams\").all();
      return teams.map(team => ({
        id: team.id,
        name: team.name,
        shortName: team.short_name,
        strength: team.strength,
        position: team.position,
        played: team.played,
        points: team.points,
        form: team.form
      }));
    },
    players: () => {
      const players = db.prepare(\"SELECT * FROM players\").all();
      return players.map(player => ({
        id: player.id,
        code: player.code,
        elementType: player.element_type,
        firstName: player.first_name,
        secondName: player.second_name,
        webName: player.web_name,
        team: player.team,
        status: player.status,
        form: player.form,
        totalPoints: player.total_points,
        eventPoints: player.event_points,
        selectedByPercent: player.selected_by_percent,
        nowCost: player.now_cost
      }));
    }
  }
};

const schema = createSchema({
  typeDefs,
  resolvers
});

const { handleRequest } = createYoga({
  schema,
  graphqlEndpoint: \"/api/graphql\",
  fetchAPI: { Response }
});

export { handleRequest as GET, handleRequest as POST };
