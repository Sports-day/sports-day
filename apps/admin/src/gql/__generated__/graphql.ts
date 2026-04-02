import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AddSportEntriesInput = {
  teamIds: Array<Scalars['ID']['input']>;
};

export type AddSportScenesInput = {
  sportIds: Array<Scalars['ID']['input']>;
};

/** SEEDスロットへのチーム手動配置 */
export type AssignSeedTeamInput = {
  slotId: Scalars['ID']['input'];
  teamId?: InputMaybe<Scalars['ID']['input']>;
};

export enum BracketState {
  Building = 'BUILDING',
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS',
  Ready = 'READY'
}

export enum BracketType {
  Main = 'MAIN',
  Sub = 'SUB'
}

export type Competition = {
  __typename?: 'Competition';
  id: Scalars['ID']['output'];
  league?: Maybe<League>;
  matches: Array<Match>;
  name: Scalars['String']['output'];
  scene: Scene;
  teams: Array<Team>;
  tournaments: Array<Tournament>;
  type: CompetitionType;
};

export enum CompetitionType {
  League = 'LEAGUE',
  Tournament = 'TOURNAMENT'
}

export type CreateCompetitionInput = {
  name: Scalars['String']['input'];
  sceneId: Scalars['ID']['input'];
  type: CompetitionType;
};

export type CreateGroupInput = {
  name: Scalars['String']['input'];
};

export type CreateImageUploadUrlInput = {
  filename: Scalars['String']['input'];
};

export type CreateInformationInput = {
  content: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CreateJudgmentInput = {
  entry: JudgmentEntry;
  id: Scalars['ID']['input'];
};

export type CreateLeagueInput = {
  defaultLocationId?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
};

export type CreateLocationInput = {
  name: Scalars['String']['input'];
};

export type CreateMatchInput = {
  competitionId: Scalars['ID']['input'];
  judgment?: InputMaybe<JudgmentEntry>;
  locationId?: InputMaybe<Scalars['ID']['input']>;
  status: MatchStatus;
  teamIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  time: Scalars['String']['input'];
};

export type CreatePromotionRuleInput = {
  rankSpec: Scalars['String']['input'];
  slot?: InputMaybe<Scalars['Int']['input']>;
  sourceCompetitionId: Scalars['ID']['input'];
  targetCompetitionId: Scalars['ID']['input'];
};

export type CreateRuleInput = {
  rule: Scalars['String']['input'];
  sportId?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateSceneInput = {
  name: Scalars['String']['input'];
};

export type CreateSportsInput = {
  name: Scalars['String']['input'];
};

export type CreateTeamInput = {
  groupId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  userIds: Array<Scalars['ID']['input']>;
};

/** SUBブラケット手動追加 */
export type CreateTournamentInput = {
  bracketType: BracketType;
  competitionId: Scalars['ID']['input'];
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  placementMethod?: InputMaybe<PlacementMethod>;
};

/** ブラケット内試合追加 */
export type CreateTournamentMatchInput = {
  judgment?: InputMaybe<JudgmentEntry>;
  slot1: SlotInput;
  slot2: SlotInput;
  time?: InputMaybe<Scalars['String']['input']>;
  tournamentId: Scalars['ID']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type DeleteSportEntriesInput = {
  teamIds: Array<Scalars['ID']['input']>;
};

export type DeleteSportScenesInput = {
  sportIds: Array<Scalars['ID']['input']>;
};

/** ブラケット自動生成 */
export type GenerateBracketInput = {
  competitionId: Scalars['ID']['input'];
  placementMethod?: InputMaybe<PlacementMethod>;
  subBrackets?: InputMaybe<Array<SubBracketInput>>;
  teamCount: Scalars['Int']['input'];
};

export type GenerateRoundRobinInput = {
  breakDuration: Scalars['Int']['input'];
  locationId?: InputMaybe<Scalars['ID']['input']>;
  matchDuration: Scalars['Int']['input'];
  startTime: Scalars['String']['input'];
};

export type Group = {
  __typename?: 'Group';
  id: Scalars['ID']['output'];
  judgments: Array<Judgment>;
  name: Scalars['String']['output'];
  teams: Array<Team>;
  users: Array<User>;
};

export type Image = {
  __typename?: 'Image';
  id: Scalars['ID']['output'];
  status: Scalars['String']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

export type ImageUploadUrl = {
  __typename?: 'ImageUploadURL';
  imageId: Scalars['ID']['output'];
  uploadUrl: Scalars['String']['output'];
};

export type Information = {
  __typename?: 'Information';
  content: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type Judgment = {
  __typename?: 'Judgment';
  group?: Maybe<Group>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  team?: Maybe<Team>;
  user?: Maybe<User>;
};

/**
 * 3 つの ID のうち **ちょうど 1 つだけ** を非 NULL にしてください。
 * 1 つも指定しない、または 2 つ以上同時に指定した場合、サーバーは BAD_REQUEST を返します。
 */
export type JudgmentEntry = {
  groupId?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  teamId?: InputMaybe<Scalars['ID']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type League = {
  __typename?: 'League';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  teams: Array<Team>;
};

export type Location = {
  __typename?: 'Location';
  id: Scalars['ID']['output'];
  matches: Array<Match>;
  name: Scalars['String']['output'];
};

export type Match = {
  __typename?: 'Match';
  competition: Competition;
  entries: Array<MatchEntry>;
  id: Scalars['ID']['output'];
  judgment?: Maybe<Judgment>;
  location?: Maybe<Location>;
  status: MatchStatus;
  time: Scalars['String']['output'];
  winnerTeam?: Maybe<Team>;
};

export type MatchEntry = {
  __typename?: 'MatchEntry';
  id: Scalars['ID']['output'];
  score: Scalars['Int']['output'];
  team?: Maybe<Team>;
};

export type MatchResultInput = {
  score: Scalars['Int']['input'];
  teamId: Scalars['ID']['input'];
};

export enum MatchStatus {
  Canceled = 'CANCELED',
  Finished = 'FINISHED',
  Ongoing = 'ONGOING',
  Standby = 'STANDBY'
}

export type Mutation = {
  __typename?: 'Mutation';
  /** 大会にチームエントリーを追加する */
  addCompetitionEntries: Competition;
  addGroupUsers: Group;
  /** 試合にチームエントリーを追加する */
  addMatchEntries: Match;
  /** スポーツシーンにチームエントリーを一括追加する */
  addSportEntries: SportScene;
  /** シーンにスポーツを一括追加する */
  addSportScenes: Scene;
  /** SEEDスロットへのチーム手動配置（teamId=null でクリア） */
  assignSeedTeam: TournamentSlot;
  /** 大会を作成する */
  createCompetition: Competition;
  createGroup: Group;
  /** 画像アップロード用のURLを発行する */
  createImageUploadURL: ImageUploadUrl;
  createInformation: Information;
  /** リーグを追加する */
  createLeague: League;
  /** 場所を追加する */
  createLocation: Location;
  /** 試合を作成する */
  createMatch: Match;
  /** 進出ルールを作成する */
  createPromotionRule: PromotionRule;
  createRule: Rule;
  createScene: Scene;
  createSports: Sport;
  /** チームを作成する */
  createTeam: Team;
  /** SUBブラケット手動追加 */
  createTournament: Tournament;
  /** ブラケット内試合追加 */
  createTournamentMatch: Match;
  createUser: User;
  /** 大会を削除する */
  deleteCompetition: Competition;
  /** 大会からチームエントリーを削除する */
  deleteCompetitionEntries: Competition;
  deleteGroup: Group;
  /** 画像を削除する（S3ファイルとDBレコードを両方削除） */
  deleteImage: Image;
  deleteInformation: Information;
  /** リーグを削除する */
  deleteLeague: League;
  /** 場所を削除する */
  deleteLocation: Location;
  /** 試合を削除する */
  deleteMatch: Match;
  /** 試合からチームエントリーを削除する */
  deleteMatchEntries: Match;
  /** 進出ルールを削除する */
  deletePromotionRule: PromotionRule;
  deleteRule: Rule;
  deleteScene: Scene;
  /** スポーツシーンからチームエントリーを一括削除する */
  deleteSportEntries: SportScene;
  /** スポーツエントリーを削除する */
  deleteSportEntry: SportEntry;
  /** スポーツシーンを削除する */
  deleteSportScene: SportScene;
  /** シーンからスポーツを一括削除する */
  deleteSportScenes: Scene;
  deleteSports: Sport;
  /** チームを削除する */
  deleteTeam: Team;
  /** ブラケット削除（SUBのみ。MAIN削除不可） */
  deleteTournament: Tournament;
  /** ブラケット内試合削除 */
  deleteTournamentMatch: Match;
  /** ブラケット自動生成（MAIN + オプショナルSUB） */
  generateBracket: Array<Tournament>;
  /** リーグの総当たり戦を自動生成する */
  generateRoundRobin: Array<Match>;
  removeGroupUsers: Group;
  /** トーナメント全体リセット（全ブラケット + 全試合を削除。competition_entries は維持） */
  resetTournamentBrackets: Competition;
  /** スポーツのランキングルールを設定する（全削除→再挿入） */
  setRankingRules: Sport;
  /** リーグのタイブレーク優先度を設定する */
  setTiebreakPriorities: Array<TiebreakPriority>;
  /** 大会の情報を更新する */
  updateCompetition: Competition;
  updateGroup: Group;
  updateInformation: Information;
  /** 審判の情報を更新する */
  updateJudgment: Judgment;
  /** リーグのルールを更新する */
  updateLeagueRule: League;
  /** 場所の情報を更新する */
  updateLocation: Location;
  /** 試合の詳細情報を更新する */
  updateMatchDetail: Match;
  /** 試合結果を更新する */
  updateMatchResult: Match;
  /** 進出ルールを更新する */
  updatePromotionRule: PromotionRule;
  updateRule: Rule;
  updateScene: Scene;
  /** seed_number 振り直し */
  updateSeedNumbers: Array<TournamentSlot>;
  /** スロット接続変更 */
  updateSlotConnection: TournamentSlot;
  updateSports: Sport;
  /** チームの情報を更新する */
  updateTeam: Team;
  /** チームメンバーを更新する */
  updateTeamUsers: Team;
  /** トーナメント（ブラケット）を更新する */
  updateTournament: Tournament;
};


export type MutationAddCompetitionEntriesArgs = {
  id: Scalars['ID']['input'];
  input: UpdateCompetitionEntriesInput;
};


export type MutationAddGroupUsersArgs = {
  id: Scalars['ID']['input'];
  input: UpdateGroupUsersInput;
};


export type MutationAddMatchEntriesArgs = {
  id: Scalars['ID']['input'];
  input: UpdateMatchEntriesInput;
};


export type MutationAddSportEntriesArgs = {
  id: Scalars['ID']['input'];
  input: AddSportEntriesInput;
};


export type MutationAddSportScenesArgs = {
  id: Scalars['ID']['input'];
  input: AddSportScenesInput;
};


export type MutationAssignSeedTeamArgs = {
  input: AssignSeedTeamInput;
};


export type MutationCreateCompetitionArgs = {
  input: CreateCompetitionInput;
};


export type MutationCreateGroupArgs = {
  input: CreateGroupInput;
};


export type MutationCreateImageUploadUrlArgs = {
  input: CreateImageUploadUrlInput;
};


export type MutationCreateInformationArgs = {
  input: CreateInformationInput;
};


export type MutationCreateLeagueArgs = {
  input: CreateLeagueInput;
};


export type MutationCreateLocationArgs = {
  input: CreateLocationInput;
};


export type MutationCreateMatchArgs = {
  input: CreateMatchInput;
};


export type MutationCreatePromotionRuleArgs = {
  input: CreatePromotionRuleInput;
};


export type MutationCreateRuleArgs = {
  input: CreateRuleInput;
};


export type MutationCreateSceneArgs = {
  input: CreateSceneInput;
};


export type MutationCreateSportsArgs = {
  input: CreateSportsInput;
};


export type MutationCreateTeamArgs = {
  input: CreateTeamInput;
};


export type MutationCreateTournamentArgs = {
  input: CreateTournamentInput;
};


export type MutationCreateTournamentMatchArgs = {
  input: CreateTournamentMatchInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteCompetitionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCompetitionEntriesArgs = {
  id: Scalars['ID']['input'];
  input: UpdateCompetitionEntriesInput;
};


export type MutationDeleteGroupArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteImageArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteInformationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteLeagueArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteLocationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteMatchArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteMatchEntriesArgs = {
  id: Scalars['ID']['input'];
  input: UpdateMatchEntriesInput;
};


export type MutationDeletePromotionRuleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteRuleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSceneArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSportEntriesArgs = {
  id: Scalars['ID']['input'];
  input: DeleteSportEntriesInput;
};


export type MutationDeleteSportEntryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSportSceneArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSportScenesArgs = {
  id: Scalars['ID']['input'];
  input: DeleteSportScenesInput;
};


export type MutationDeleteSportsArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTeamArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTournamentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTournamentMatchArgs = {
  matchId: Scalars['ID']['input'];
};


export type MutationGenerateBracketArgs = {
  input: GenerateBracketInput;
};


export type MutationGenerateRoundRobinArgs = {
  id: Scalars['ID']['input'];
  input: GenerateRoundRobinInput;
};


export type MutationRemoveGroupUsersArgs = {
  id: Scalars['ID']['input'];
  input: UpdateGroupUsersInput;
};


export type MutationResetTournamentBracketsArgs = {
  competitionId: Scalars['ID']['input'];
};


export type MutationSetRankingRulesArgs = {
  rules: Array<RankingRuleInput>;
  sportId: Scalars['ID']['input'];
};


export type MutationSetTiebreakPrioritiesArgs = {
  leagueId: Scalars['ID']['input'];
  priorities: Array<TiebreakPriorityInput>;
};


export type MutationUpdateCompetitionArgs = {
  id: Scalars['ID']['input'];
  input: UpdateCompetitionInput;
};


export type MutationUpdateGroupArgs = {
  id: Scalars['ID']['input'];
  input: UpdateGroupInput;
};


export type MutationUpdateInformationArgs = {
  id: Scalars['ID']['input'];
  input: UpdateInformationInput;
};


export type MutationUpdateJudgmentArgs = {
  id: Scalars['ID']['input'];
  input: UpdateJudgmentInput;
};


export type MutationUpdateLeagueRuleArgs = {
  id: Scalars['ID']['input'];
  input: UpdateLeagueRuleInput;
};


export type MutationUpdateLocationArgs = {
  id: Scalars['ID']['input'];
  input: UpdateLocationInput;
};


export type MutationUpdateMatchDetailArgs = {
  id: Scalars['ID']['input'];
  input: UpdateMatchDetailInput;
};


export type MutationUpdateMatchResultArgs = {
  id: Scalars['ID']['input'];
  input: UpdateMatchResultInput;
};


export type MutationUpdatePromotionRuleArgs = {
  id: Scalars['ID']['input'];
  input: UpdatePromotionRuleInput;
};


export type MutationUpdateRuleArgs = {
  id: Scalars['ID']['input'];
  input: UpdateRuleInput;
};


export type MutationUpdateSceneArgs = {
  id: Scalars['ID']['input'];
  input: UpdateSceneInput;
};


export type MutationUpdateSeedNumbersArgs = {
  seeds: Array<SeedNumberInput>;
  tournamentId: Scalars['ID']['input'];
};


export type MutationUpdateSlotConnectionArgs = {
  input: UpdateSlotConnectionInput;
};


export type MutationUpdateSportsArgs = {
  id: Scalars['ID']['input'];
  input: UpdateSportsInput;
};


export type MutationUpdateTeamArgs = {
  id: Scalars['ID']['input'];
  input: UpdateTeamInput;
};


export type MutationUpdateTeamUsersArgs = {
  id: Scalars['ID']['input'];
  input: UpdateTeamUsersInput;
};


export type MutationUpdateTournamentArgs = {
  id: Scalars['ID']['input'];
  input: UpdateTournamentInput;
};

export enum PlacementMethod {
  Balanced = 'BALANCED',
  Manual = 'MANUAL',
  Random = 'RANDOM',
  SeedOptimized = 'SEED_OPTIMIZED'
}

export type PromotionRule = {
  __typename?: 'PromotionRule';
  id: Scalars['ID']['output'];
  rankSpec: Scalars['String']['output'];
  slot?: Maybe<Scalars['Int']['output']>;
  sourceCompetition: Competition;
  targetCompetition: Competition;
};

export type PromotionStatus = {
  __typename?: 'PromotionStatus';
  currentEntryCount: Scalars['Int']['output'];
  expectedTeamCount: Scalars['Int']['output'];
  targetCompetitionId: Scalars['ID']['output'];
};

export type Query = {
  __typename?: 'Query';
  Information: Information;
  Informations: Array<Information>;
  /** ID指定で大会を取得する */
  competition: Competition;
  /** 大会をまとめて取得する */
  competitions: Array<Competition>;
  group: Group;
  groups: Array<Group>;
  /** ID指定で画像を取得する */
  image: Image;
  /** 画像一覧を取得する */
  images: Array<Image>;
  /** ID指定で試合を取得する */
  judgment: Judgment;
  /** 審判をまとめて取得する */
  judgments: Array<Judgment>;
  /** ID指定でリーグを取得する */
  league: League;
  /** リーグの順位表をリアルタイム計算で取得する */
  leagueStandings: Array<Standing>;
  /** リーグをまとめて取得する */
  leagues: Array<League>;
  /** ID指定で場所を取得する */
  location: Location;
  /** 場所をまとめて取得する */
  locations: Array<Location>;
  /** ID指定で試合を取得する */
  match: Match;
  /** 試合をまとめて取得する */
  matches: Array<Match>;
  me: User;
  /** 進出ルールを取得する（進出元の大会IDで絞り込み） */
  promotionRules: Array<PromotionRule>;
  /** 進出先の期待チーム数と現在のエントリー数を取得する */
  promotionStatus: PromotionStatus;
  rule: Rule;
  rules: Array<Maybe<Rule>>;
  scene: Scene;
  scenes: Array<Scene>;
  sport: Sport;
  sports: Array<Sport>;
  /** ID指定でチームを取得する */
  team: Team;
  /** チームをまとめて取得する */
  teams: Array<Team>;
  /** ブラケット単体取得 */
  tournament: Tournament;
  /** トーナメント順位（全ブラケット統合） */
  tournamentRanking: Array<TournamentRanking>;
  /** competition内の全ブラケット取得 */
  tournaments: Array<Tournament>;
  user: User;
  users: Array<User>;
};


export type QueryInformationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCompetitionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGroupArgs = {
  id: Scalars['ID']['input'];
};


export type QueryImageArgs = {
  id: Scalars['ID']['input'];
};


export type QueryJudgmentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLeagueArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLeagueStandingsArgs = {
  leagueId: Scalars['ID']['input'];
};


export type QueryLocationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMatchArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPromotionRulesArgs = {
  sourceCompetitionId: Scalars['ID']['input'];
};


export type QueryPromotionStatusArgs = {
  targetCompetitionId: Scalars['ID']['input'];
};


export type QueryRuleArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySceneArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySportArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTeamArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTournamentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTournamentRankingArgs = {
  competitionId: Scalars['ID']['input'];
};


export type QueryTournamentsArgs = {
  competitionId: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export enum RankingConditionKey {
  AdminDecision = 'ADMIN_DECISION',
  GoalDiff = 'GOAL_DIFF',
  HeadToHead = 'HEAD_TO_HEAD',
  TotalGoals = 'TOTAL_GOALS',
  WinPoints = 'WIN_POINTS'
}

export type RankingRule = {
  __typename?: 'RankingRule';
  conditionKey: RankingConditionKey;
  priority: Scalars['Int']['output'];
};

export type RankingRuleInput = {
  conditionKey: RankingConditionKey;
  priority: Scalars['Int']['input'];
};

export type Rule = {
  __typename?: 'Rule';
  id?: Maybe<Scalars['ID']['output']>;
  rule: Scalars['String']['output'];
  sport?: Maybe<Sport>;
};

export type Scene = {
  __typename?: 'Scene';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  sportScenes: Array<SportScene>;
};

/** seed_number 振り直し */
export type SeedNumberInput = {
  seedNumber: Scalars['Int']['input'];
  slotId: Scalars['ID']['input'];
};

/** スロットのソース指定 */
export type SlotInput = {
  seedNumber?: InputMaybe<Scalars['Int']['input']>;
  sourceMatchId?: InputMaybe<Scalars['ID']['input']>;
  sourceType: SlotSourceType;
};

export enum SlotSourceType {
  MatchLoser = 'MATCH_LOSER',
  MatchWinner = 'MATCH_WINNER',
  Seed = 'SEED'
}

export type Sport = {
  __typename?: 'Sport';
  id: Scalars['ID']['output'];
  image?: Maybe<Image>;
  name: Scalars['String']['output'];
  rankingRules: Array<RankingRule>;
  rules: Array<Rule>;
  scene?: Maybe<Array<SportScene>>;
  weight: Scalars['Int']['output'];
};

export type SportEntry = {
  __typename?: 'SportEntry';
  id: Scalars['ID']['output'];
  sportScene: SportScene;
  team: Team;
};

export type SportScene = {
  __typename?: 'SportScene';
  entries: Array<SportEntry>;
  id: Scalars['ID']['output'];
  scene: Scene;
  sport: Sport;
};

export type Standing = {
  __typename?: 'Standing';
  draw: Scalars['Int']['output'];
  goalDiff: Scalars['Int']['output'];
  goalsAgainst: Scalars['Int']['output'];
  goalsFor: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  lose: Scalars['Int']['output'];
  matchesPlayed: Scalars['Int']['output'];
  points: Scalars['Int']['output'];
  rank: Scalars['Int']['output'];
  team: Team;
  win: Scalars['Int']['output'];
};

/** SUBブラケット定義（自動生成用） */
export type SubBracketInput = {
  name: Scalars['String']['input'];
  sourceRound: Scalars['Int']['input'];
};

export type Team = {
  __typename?: 'Team';
  competitions: Array<Competition>;
  group: Group;
  id: Scalars['ID']['output'];
  judgments: Array<Judgment>;
  leagues: Array<League>;
  matches: Array<Match>;
  name: Scalars['String']['output'];
  users: Array<User>;
};

export type TiebreakPriority = {
  __typename?: 'TiebreakPriority';
  priority: Scalars['Int']['output'];
  team: Team;
};

export type TiebreakPriorityInput = {
  priority: Scalars['Int']['input'];
  teamId: Scalars['ID']['input'];
};

export type Tournament = {
  __typename?: 'Tournament';
  bracketType: BracketType;
  competition: Competition;
  displayOrder: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  matches: Array<Match>;
  name: Scalars['String']['output'];
  placementMethod?: Maybe<PlacementMethod>;
  progress: Scalars['Float']['output'];
  slots: Array<TournamentSlot>;
  state: BracketState;
};

export type TournamentRanking = {
  __typename?: 'TournamentRanking';
  isTied: Scalars['Boolean']['output'];
  rank: Scalars['Int']['output'];
  team: Team;
};

export type TournamentSlot = {
  __typename?: 'TournamentSlot';
  id: Scalars['ID']['output'];
  matchEntry: MatchEntry;
  seedNumber?: Maybe<Scalars['Int']['output']>;
  sourceMatch?: Maybe<Match>;
  sourceType: SlotSourceType;
  tournament: Tournament;
};

export type UpdateCompetitionEntriesInput = {
  teamIds: Array<Scalars['ID']['input']>;
};

export type UpdateCompetitionInput = {
  imageId?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateGroupInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateGroupUsersInput = {
  userIds: Array<Scalars['ID']['input']>;
};

export type UpdateInformationInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateJudgmentInput = {
  entry?: InputMaybe<JudgmentEntry>;
};

export type UpdateLeagueRuleInput = {
  drawPt?: InputMaybe<Scalars['Int']['input']>;
  losePt?: InputMaybe<Scalars['Int']['input']>;
  winPt?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateLocationInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMatchDetailInput = {
  locationId?: InputMaybe<Scalars['ID']['input']>;
  time?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMatchEntriesInput = {
  teamIds: Array<Scalars['ID']['input']>;
};

export type UpdateMatchEntryScoreInput = {
  score: Scalars['Int']['input'];
  teamId: Scalars['ID']['input'];
};

export type UpdateMatchResultInput = {
  results?: InputMaybe<Array<MatchResultInput>>;
  status?: InputMaybe<MatchStatus>;
  winnerTeamId?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdatePromotionRuleInput = {
  rankSpec?: InputMaybe<Scalars['String']['input']>;
  slot?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateRuleInput = {
  rule?: InputMaybe<Scalars['String']['input']>;
  sportId?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateSceneInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

/** スロット接続変更 */
export type UpdateSlotConnectionInput = {
  seedNumber?: InputMaybe<Scalars['Int']['input']>;
  slotId: Scalars['ID']['input'];
  sourceMatchId?: InputMaybe<Scalars['ID']['input']>;
  sourceType: SlotSourceType;
};

export type UpdateSportsInput = {
  imageId?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  weight?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateTeamInput = {
  groupId?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTeamUsersInput = {
  addUserIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  removeUserIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

/** トーナメント（ブラケット）更新 */
export type UpdateTournamentInput = {
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  groups: Array<Group>;
  id: Scalars['ID']['output'];
  judgments: Array<Judgment>;
  name: Scalars['String']['output'];
  teams: Array<Team>;
};

export type GetAdminCompetitionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdminCompetitionsQuery = { __typename?: 'Query', competitions: Array<{ __typename?: 'Competition', id: string, name: string, type: CompetitionType, scene: { __typename?: 'Scene', id: string, name: string } }> };

export type GetAdminCompetitionQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetAdminCompetitionQuery = { __typename?: 'Query', competition: { __typename?: 'Competition', id: string, name: string, type: CompetitionType, scene: { __typename?: 'Scene', id: string, name: string }, teams: Array<{ __typename?: 'Team', id: string, name: string, group: { __typename?: 'Group', id: string, name: string } }> } };

export type GetAdminLeaguesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdminLeaguesQuery = { __typename?: 'Query', leagues: Array<{ __typename?: 'League', id: string, name: string, teams: Array<{ __typename?: 'Team', id: string, name: string }> }> };

export type GetAdminLeagueQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetAdminLeagueQuery = { __typename?: 'Query', league: { __typename?: 'League', id: string, name: string, teams: Array<{ __typename?: 'Team', id: string, name: string, group: { __typename?: 'Group', id: string, name: string } }> } };

export type GetAdminLeagueStandingsQueryVariables = Exact<{
  leagueId: Scalars['ID']['input'];
}>;


export type GetAdminLeagueStandingsQuery = { __typename?: 'Query', leagueStandings: Array<{ __typename?: 'Standing', id: string, points: number, rank: number, win: number, draw: number, lose: number, goalsFor: number, goalsAgainst: number, goalDiff: number, team: { __typename?: 'Team', id: string, name: string } }> };

export type GetAdminTournamentsQueryVariables = Exact<{
  competitionId: Scalars['ID']['input'];
}>;


export type GetAdminTournamentsQuery = { __typename?: 'Query', tournaments: Array<{ __typename?: 'Tournament', id: string, name: string, bracketType: BracketType, placementMethod?: PlacementMethod | null, state: BracketState, progress: number }> };

export type GetAdminTournamentQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetAdminTournamentQuery = { __typename?: 'Query', tournament: { __typename?: 'Tournament', id: string, name: string, bracketType: BracketType, placementMethod?: PlacementMethod | null, displayOrder: number, state: BracketState, progress: number, competition: { __typename?: 'Competition', id: string, name: string }, matches: Array<{ __typename?: 'Match', id: string, time: string, status: MatchStatus, entries: Array<{ __typename?: 'MatchEntry', id: string, score: number, team?: { __typename?: 'Team', id: string, name: string } | null }> }>, slots: Array<{ __typename?: 'TournamentSlot', id: string, sourceType: SlotSourceType, seedNumber?: number | null, sourceMatch?: { __typename?: 'Match', id: string } | null, matchEntry: { __typename?: 'MatchEntry', id: string, score: number, team?: { __typename?: 'Team', id: string, name: string } | null } }> } };

export type GetAdminScenesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdminScenesQuery = { __typename?: 'Query', scenes: Array<{ __typename?: 'Scene', id: string, name: string }> };

export type CreateAdminCompetitionMutationVariables = Exact<{
  input: CreateCompetitionInput;
}>;


export type CreateAdminCompetitionMutation = { __typename?: 'Mutation', createCompetition: { __typename?: 'Competition', id: string, name: string, type: CompetitionType, scene: { __typename?: 'Scene', id: string, name: string } } };

export type UpdateAdminCompetitionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateCompetitionInput;
}>;


export type UpdateAdminCompetitionMutation = { __typename?: 'Mutation', updateCompetition: { __typename?: 'Competition', id: string, name: string } };

export type DeleteAdminCompetitionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteAdminCompetitionMutation = { __typename?: 'Mutation', deleteCompetition: { __typename?: 'Competition', id: string } };

export type CreateAdminLeagueMutationVariables = Exact<{
  input: CreateLeagueInput;
}>;


export type CreateAdminLeagueMutation = { __typename?: 'Mutation', createLeague: { __typename?: 'League', id: string, name: string } };

export type DeleteAdminLeagueMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteAdminLeagueMutation = { __typename?: 'Mutation', deleteLeague: { __typename?: 'League', id: string } };

export type UpdateAdminLeagueRuleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateLeagueRuleInput;
}>;


export type UpdateAdminLeagueRuleMutation = { __typename?: 'Mutation', updateLeagueRule: { __typename?: 'League', id: string, name: string } };

export type GenerateAdminRoundRobinMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: GenerateRoundRobinInput;
}>;


export type GenerateAdminRoundRobinMutation = { __typename?: 'Mutation', generateRoundRobin: Array<{ __typename?: 'Match', id: string }> };

export type CreateAdminTournamentMutationVariables = Exact<{
  input: CreateTournamentInput;
}>;


export type CreateAdminTournamentMutation = { __typename?: 'Mutation', createTournament: { __typename?: 'Tournament', id: string, name: string, bracketType: BracketType } };

export type GetAdminMatchesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdminMatchesQuery = { __typename?: 'Query', matches: Array<{ __typename?: 'Match', id: string, time: string, status: MatchStatus, location?: { __typename?: 'Location', id: string, name: string } | null, competition: { __typename?: 'Competition', id: string, name: string }, entries: Array<{ __typename?: 'MatchEntry', id: string, score: number, team?: { __typename?: 'Team', id: string, name: string } | null }> }> };

export type GetAdminMatchQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetAdminMatchQuery = { __typename?: 'Query', match: { __typename?: 'Match', id: string, time: string, status: MatchStatus, location?: { __typename?: 'Location', id: string, name: string } | null, competition: { __typename?: 'Competition', id: string, name: string }, entries: Array<{ __typename?: 'MatchEntry', id: string, score: number, team?: { __typename?: 'Team', id: string, name: string } | null }> } };

export type UpdateAdminMatchResultMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateMatchResultInput;
}>;


export type UpdateAdminMatchResultMutation = { __typename?: 'Mutation', updateMatchResult: { __typename?: 'Match', id: string, status: MatchStatus, entries: Array<{ __typename?: 'MatchEntry', id: string, score: number, team?: { __typename?: 'Team', id: string, name: string } | null }> } };

export type UpdateAdminMatchDetailMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateMatchDetailInput;
}>;


export type UpdateAdminMatchDetailMutation = { __typename?: 'Mutation', updateMatchDetail: { __typename?: 'Match', id: string, time: string, location?: { __typename?: 'Location', id: string, name: string } | null } };

export type GetAdminTeamsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdminTeamsQuery = { __typename?: 'Query', teams: Array<{ __typename?: 'Team', id: string, name: string, group: { __typename?: 'Group', id: string, name: string }, users: Array<{ __typename?: 'User', id: string, name: string, email: string }> }> };

export type GetAdminTeamQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetAdminTeamQuery = { __typename?: 'Query', team: { __typename?: 'Team', id: string, name: string, group: { __typename?: 'Group', id: string, name: string }, users: Array<{ __typename?: 'User', id: string, name: string, email: string }> } };

export type CreateAdminTeamMutationVariables = Exact<{
  input: CreateTeamInput;
}>;


export type CreateAdminTeamMutation = { __typename?: 'Mutation', createTeam: { __typename?: 'Team', id: string, name: string, group: { __typename?: 'Group', id: string, name: string } } };

export type UpdateAdminTeamMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateTeamInput;
}>;


export type UpdateAdminTeamMutation = { __typename?: 'Mutation', updateTeam: { __typename?: 'Team', id: string, name: string, group: { __typename?: 'Group', id: string, name: string } } };

export type DeleteAdminTeamMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteAdminTeamMutation = { __typename?: 'Mutation', deleteTeam: { __typename?: 'Team', id: string } };

export type UpdateAdminTeamUsersMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateTeamUsersInput;
}>;


export type UpdateAdminTeamUsersMutation = { __typename?: 'Mutation', updateTeamUsers: { __typename?: 'Team', id: string, users: Array<{ __typename?: 'User', id: string, name: string, email: string }> } };

export type GetAdminAllUsersForTeamsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdminAllUsersForTeamsQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, name: string, email: string, groups: Array<{ __typename?: 'Group', id: string, name: string }> }> };

export type GetAdminUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdminUsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, name: string, email: string, groups: Array<{ __typename?: 'Group', id: string, name: string }>, teams: Array<{ __typename?: 'Team', id: string, name: string }> }> };

export type GetAdminUserQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetAdminUserQuery = { __typename?: 'Query', user: { __typename?: 'User', id: string, name: string, email: string, groups: Array<{ __typename?: 'Group', id: string, name: string }>, teams: Array<{ __typename?: 'Team', id: string, name: string }> } };

export type CreateAdminUserMutationVariables = Exact<{
  input: CreateUserInput;
}>;


export type CreateAdminUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', id: string, name: string, email: string } };


export const GetAdminCompetitionsDocument = gql`
    query GetAdminCompetitions {
  competitions {
    id
    name
    type
    scene {
      id
      name
    }
  }
}
    `;

/**
 * __useGetAdminCompetitionsQuery__
 *
 * To run a query within a React component, call `useGetAdminCompetitionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminCompetitionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminCompetitionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAdminCompetitionsQuery(baseOptions?: Apollo.QueryHookOptions<GetAdminCompetitionsQuery, GetAdminCompetitionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAdminCompetitionsQuery, GetAdminCompetitionsQueryVariables>(GetAdminCompetitionsDocument, options);
      }
export function useGetAdminCompetitionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAdminCompetitionsQuery, GetAdminCompetitionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAdminCompetitionsQuery, GetAdminCompetitionsQueryVariables>(GetAdminCompetitionsDocument, options);
        }
export function useGetAdminCompetitionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAdminCompetitionsQuery, GetAdminCompetitionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAdminCompetitionsQuery, GetAdminCompetitionsQueryVariables>(GetAdminCompetitionsDocument, options);
        }
export type GetAdminCompetitionsQueryHookResult = ReturnType<typeof useGetAdminCompetitionsQuery>;
export type GetAdminCompetitionsLazyQueryHookResult = ReturnType<typeof useGetAdminCompetitionsLazyQuery>;
export type GetAdminCompetitionsSuspenseQueryHookResult = ReturnType<typeof useGetAdminCompetitionsSuspenseQuery>;
export type GetAdminCompetitionsQueryResult = Apollo.QueryResult<GetAdminCompetitionsQuery, GetAdminCompetitionsQueryVariables>;
export const GetAdminCompetitionDocument = gql`
    query GetAdminCompetition($id: ID!) {
  competition(id: $id) {
    id
    name
    type
    scene {
      id
      name
    }
    teams {
      id
      name
      group {
        id
        name
      }
    }
  }
}
    `;

/**
 * __useGetAdminCompetitionQuery__
 *
 * To run a query within a React component, call `useGetAdminCompetitionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminCompetitionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminCompetitionQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetAdminCompetitionQuery(baseOptions: Apollo.QueryHookOptions<GetAdminCompetitionQuery, GetAdminCompetitionQueryVariables> & ({ variables: GetAdminCompetitionQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAdminCompetitionQuery, GetAdminCompetitionQueryVariables>(GetAdminCompetitionDocument, options);
      }
export function useGetAdminCompetitionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAdminCompetitionQuery, GetAdminCompetitionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAdminCompetitionQuery, GetAdminCompetitionQueryVariables>(GetAdminCompetitionDocument, options);
        }
export function useGetAdminCompetitionSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAdminCompetitionQuery, GetAdminCompetitionQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAdminCompetitionQuery, GetAdminCompetitionQueryVariables>(GetAdminCompetitionDocument, options);
        }
export type GetAdminCompetitionQueryHookResult = ReturnType<typeof useGetAdminCompetitionQuery>;
export type GetAdminCompetitionLazyQueryHookResult = ReturnType<typeof useGetAdminCompetitionLazyQuery>;
export type GetAdminCompetitionSuspenseQueryHookResult = ReturnType<typeof useGetAdminCompetitionSuspenseQuery>;
export type GetAdminCompetitionQueryResult = Apollo.QueryResult<GetAdminCompetitionQuery, GetAdminCompetitionQueryVariables>;
export const GetAdminLeaguesDocument = gql`
    query GetAdminLeagues {
  leagues {
    id
    name
    teams {
      id
      name
    }
  }
}
    `;

/**
 * __useGetAdminLeaguesQuery__
 *
 * To run a query within a React component, call `useGetAdminLeaguesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminLeaguesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminLeaguesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAdminLeaguesQuery(baseOptions?: Apollo.QueryHookOptions<GetAdminLeaguesQuery, GetAdminLeaguesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAdminLeaguesQuery, GetAdminLeaguesQueryVariables>(GetAdminLeaguesDocument, options);
      }
export function useGetAdminLeaguesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAdminLeaguesQuery, GetAdminLeaguesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAdminLeaguesQuery, GetAdminLeaguesQueryVariables>(GetAdminLeaguesDocument, options);
        }
export function useGetAdminLeaguesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAdminLeaguesQuery, GetAdminLeaguesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAdminLeaguesQuery, GetAdminLeaguesQueryVariables>(GetAdminLeaguesDocument, options);
        }
export type GetAdminLeaguesQueryHookResult = ReturnType<typeof useGetAdminLeaguesQuery>;
export type GetAdminLeaguesLazyQueryHookResult = ReturnType<typeof useGetAdminLeaguesLazyQuery>;
export type GetAdminLeaguesSuspenseQueryHookResult = ReturnType<typeof useGetAdminLeaguesSuspenseQuery>;
export type GetAdminLeaguesQueryResult = Apollo.QueryResult<GetAdminLeaguesQuery, GetAdminLeaguesQueryVariables>;
export const GetAdminLeagueDocument = gql`
    query GetAdminLeague($id: ID!) {
  league(id: $id) {
    id
    name
    teams {
      id
      name
      group {
        id
        name
      }
    }
  }
}
    `;

/**
 * __useGetAdminLeagueQuery__
 *
 * To run a query within a React component, call `useGetAdminLeagueQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminLeagueQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminLeagueQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetAdminLeagueQuery(baseOptions: Apollo.QueryHookOptions<GetAdminLeagueQuery, GetAdminLeagueQueryVariables> & ({ variables: GetAdminLeagueQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAdminLeagueQuery, GetAdminLeagueQueryVariables>(GetAdminLeagueDocument, options);
      }
export function useGetAdminLeagueLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAdminLeagueQuery, GetAdminLeagueQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAdminLeagueQuery, GetAdminLeagueQueryVariables>(GetAdminLeagueDocument, options);
        }
export function useGetAdminLeagueSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAdminLeagueQuery, GetAdminLeagueQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAdminLeagueQuery, GetAdminLeagueQueryVariables>(GetAdminLeagueDocument, options);
        }
export type GetAdminLeagueQueryHookResult = ReturnType<typeof useGetAdminLeagueQuery>;
export type GetAdminLeagueLazyQueryHookResult = ReturnType<typeof useGetAdminLeagueLazyQuery>;
export type GetAdminLeagueSuspenseQueryHookResult = ReturnType<typeof useGetAdminLeagueSuspenseQuery>;
export type GetAdminLeagueQueryResult = Apollo.QueryResult<GetAdminLeagueQuery, GetAdminLeagueQueryVariables>;
export const GetAdminLeagueStandingsDocument = gql`
    query GetAdminLeagueStandings($leagueId: ID!) {
  leagueStandings(leagueId: $leagueId) {
    id
    team {
      id
      name
    }
    points
    rank
    win
    draw
    lose
    goalsFor
    goalsAgainst
    goalDiff
  }
}
    `;

/**
 * __useGetAdminLeagueStandingsQuery__
 *
 * To run a query within a React component, call `useGetAdminLeagueStandingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminLeagueStandingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminLeagueStandingsQuery({
 *   variables: {
 *      leagueId: // value for 'leagueId'
 *   },
 * });
 */
export function useGetAdminLeagueStandingsQuery(baseOptions: Apollo.QueryHookOptions<GetAdminLeagueStandingsQuery, GetAdminLeagueStandingsQueryVariables> & ({ variables: GetAdminLeagueStandingsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAdminLeagueStandingsQuery, GetAdminLeagueStandingsQueryVariables>(GetAdminLeagueStandingsDocument, options);
      }
export function useGetAdminLeagueStandingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAdminLeagueStandingsQuery, GetAdminLeagueStandingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAdminLeagueStandingsQuery, GetAdminLeagueStandingsQueryVariables>(GetAdminLeagueStandingsDocument, options);
        }
export function useGetAdminLeagueStandingsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAdminLeagueStandingsQuery, GetAdminLeagueStandingsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAdminLeagueStandingsQuery, GetAdminLeagueStandingsQueryVariables>(GetAdminLeagueStandingsDocument, options);
        }
export type GetAdminLeagueStandingsQueryHookResult = ReturnType<typeof useGetAdminLeagueStandingsQuery>;
export type GetAdminLeagueStandingsLazyQueryHookResult = ReturnType<typeof useGetAdminLeagueStandingsLazyQuery>;
export type GetAdminLeagueStandingsSuspenseQueryHookResult = ReturnType<typeof useGetAdminLeagueStandingsSuspenseQuery>;
export type GetAdminLeagueStandingsQueryResult = Apollo.QueryResult<GetAdminLeagueStandingsQuery, GetAdminLeagueStandingsQueryVariables>;
export const GetAdminTournamentsDocument = gql`
    query GetAdminTournaments($competitionId: ID!) {
  tournaments(competitionId: $competitionId) {
    id
    name
    bracketType
    placementMethod
    state
    progress
  }
}
    `;

/**
 * __useGetAdminTournamentsQuery__
 *
 * To run a query within a React component, call `useGetAdminTournamentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminTournamentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminTournamentsQuery({
 *   variables: {
 *      competitionId: // value for 'competitionId'
 *   },
 * });
 */
export function useGetAdminTournamentsQuery(baseOptions: Apollo.QueryHookOptions<GetAdminTournamentsQuery, GetAdminTournamentsQueryVariables> & ({ variables: GetAdminTournamentsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAdminTournamentsQuery, GetAdminTournamentsQueryVariables>(GetAdminTournamentsDocument, options);
      }
export function useGetAdminTournamentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAdminTournamentsQuery, GetAdminTournamentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAdminTournamentsQuery, GetAdminTournamentsQueryVariables>(GetAdminTournamentsDocument, options);
        }
export function useGetAdminTournamentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAdminTournamentsQuery, GetAdminTournamentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAdminTournamentsQuery, GetAdminTournamentsQueryVariables>(GetAdminTournamentsDocument, options);
        }
export type GetAdminTournamentsQueryHookResult = ReturnType<typeof useGetAdminTournamentsQuery>;
export type GetAdminTournamentsLazyQueryHookResult = ReturnType<typeof useGetAdminTournamentsLazyQuery>;
export type GetAdminTournamentsSuspenseQueryHookResult = ReturnType<typeof useGetAdminTournamentsSuspenseQuery>;
export type GetAdminTournamentsQueryResult = Apollo.QueryResult<GetAdminTournamentsQuery, GetAdminTournamentsQueryVariables>;
export const GetAdminTournamentDocument = gql`
    query GetAdminTournament($id: ID!) {
  tournament(id: $id) {
    id
    competition {
      id
      name
    }
    name
    bracketType
    placementMethod
    displayOrder
    state
    progress
    matches {
      id
      time
      status
      entries {
        id
        team {
          id
          name
        }
        score
      }
    }
    slots {
      id
      sourceType
      seedNumber
      sourceMatch {
        id
      }
      matchEntry {
        id
        team {
          id
          name
        }
        score
      }
    }
  }
}
    `;

/**
 * __useGetAdminTournamentQuery__
 *
 * To run a query within a React component, call `useGetAdminTournamentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminTournamentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminTournamentQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetAdminTournamentQuery(baseOptions: Apollo.QueryHookOptions<GetAdminTournamentQuery, GetAdminTournamentQueryVariables> & ({ variables: GetAdminTournamentQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAdminTournamentQuery, GetAdminTournamentQueryVariables>(GetAdminTournamentDocument, options);
      }
export function useGetAdminTournamentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAdminTournamentQuery, GetAdminTournamentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAdminTournamentQuery, GetAdminTournamentQueryVariables>(GetAdminTournamentDocument, options);
        }
export function useGetAdminTournamentSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAdminTournamentQuery, GetAdminTournamentQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAdminTournamentQuery, GetAdminTournamentQueryVariables>(GetAdminTournamentDocument, options);
        }
export type GetAdminTournamentQueryHookResult = ReturnType<typeof useGetAdminTournamentQuery>;
export type GetAdminTournamentLazyQueryHookResult = ReturnType<typeof useGetAdminTournamentLazyQuery>;
export type GetAdminTournamentSuspenseQueryHookResult = ReturnType<typeof useGetAdminTournamentSuspenseQuery>;
export type GetAdminTournamentQueryResult = Apollo.QueryResult<GetAdminTournamentQuery, GetAdminTournamentQueryVariables>;
export const GetAdminScenesDocument = gql`
    query GetAdminScenes {
  scenes {
    id
    name
  }
}
    `;

/**
 * __useGetAdminScenesQuery__
 *
 * To run a query within a React component, call `useGetAdminScenesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminScenesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminScenesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAdminScenesQuery(baseOptions?: Apollo.QueryHookOptions<GetAdminScenesQuery, GetAdminScenesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAdminScenesQuery, GetAdminScenesQueryVariables>(GetAdminScenesDocument, options);
      }
export function useGetAdminScenesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAdminScenesQuery, GetAdminScenesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAdminScenesQuery, GetAdminScenesQueryVariables>(GetAdminScenesDocument, options);
        }
export function useGetAdminScenesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAdminScenesQuery, GetAdminScenesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAdminScenesQuery, GetAdminScenesQueryVariables>(GetAdminScenesDocument, options);
        }
export type GetAdminScenesQueryHookResult = ReturnType<typeof useGetAdminScenesQuery>;
export type GetAdminScenesLazyQueryHookResult = ReturnType<typeof useGetAdminScenesLazyQuery>;
export type GetAdminScenesSuspenseQueryHookResult = ReturnType<typeof useGetAdminScenesSuspenseQuery>;
export type GetAdminScenesQueryResult = Apollo.QueryResult<GetAdminScenesQuery, GetAdminScenesQueryVariables>;
export const CreateAdminCompetitionDocument = gql`
    mutation CreateAdminCompetition($input: CreateCompetitionInput!) {
  createCompetition(input: $input) {
    id
    name
    type
    scene {
      id
      name
    }
  }
}
    `;
export type CreateAdminCompetitionMutationFn = Apollo.MutationFunction<CreateAdminCompetitionMutation, CreateAdminCompetitionMutationVariables>;

/**
 * __useCreateAdminCompetitionMutation__
 *
 * To run a mutation, you first call `useCreateAdminCompetitionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAdminCompetitionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAdminCompetitionMutation, { data, loading, error }] = useCreateAdminCompetitionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateAdminCompetitionMutation(baseOptions?: Apollo.MutationHookOptions<CreateAdminCompetitionMutation, CreateAdminCompetitionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAdminCompetitionMutation, CreateAdminCompetitionMutationVariables>(CreateAdminCompetitionDocument, options);
      }
export type CreateAdminCompetitionMutationHookResult = ReturnType<typeof useCreateAdminCompetitionMutation>;
export type CreateAdminCompetitionMutationResult = Apollo.MutationResult<CreateAdminCompetitionMutation>;
export type CreateAdminCompetitionMutationOptions = Apollo.BaseMutationOptions<CreateAdminCompetitionMutation, CreateAdminCompetitionMutationVariables>;
export const UpdateAdminCompetitionDocument = gql`
    mutation UpdateAdminCompetition($id: ID!, $input: UpdateCompetitionInput!) {
  updateCompetition(id: $id, input: $input) {
    id
    name
  }
}
    `;
export type UpdateAdminCompetitionMutationFn = Apollo.MutationFunction<UpdateAdminCompetitionMutation, UpdateAdminCompetitionMutationVariables>;

/**
 * __useUpdateAdminCompetitionMutation__
 *
 * To run a mutation, you first call `useUpdateAdminCompetitionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAdminCompetitionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAdminCompetitionMutation, { data, loading, error }] = useUpdateAdminCompetitionMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateAdminCompetitionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAdminCompetitionMutation, UpdateAdminCompetitionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAdminCompetitionMutation, UpdateAdminCompetitionMutationVariables>(UpdateAdminCompetitionDocument, options);
      }
export type UpdateAdminCompetitionMutationHookResult = ReturnType<typeof useUpdateAdminCompetitionMutation>;
export type UpdateAdminCompetitionMutationResult = Apollo.MutationResult<UpdateAdminCompetitionMutation>;
export type UpdateAdminCompetitionMutationOptions = Apollo.BaseMutationOptions<UpdateAdminCompetitionMutation, UpdateAdminCompetitionMutationVariables>;
export const DeleteAdminCompetitionDocument = gql`
    mutation DeleteAdminCompetition($id: ID!) {
  deleteCompetition(id: $id) {
    id
  }
}
    `;
export type DeleteAdminCompetitionMutationFn = Apollo.MutationFunction<DeleteAdminCompetitionMutation, DeleteAdminCompetitionMutationVariables>;

/**
 * __useDeleteAdminCompetitionMutation__
 *
 * To run a mutation, you first call `useDeleteAdminCompetitionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAdminCompetitionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAdminCompetitionMutation, { data, loading, error }] = useDeleteAdminCompetitionMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteAdminCompetitionMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAdminCompetitionMutation, DeleteAdminCompetitionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAdminCompetitionMutation, DeleteAdminCompetitionMutationVariables>(DeleteAdminCompetitionDocument, options);
      }
export type DeleteAdminCompetitionMutationHookResult = ReturnType<typeof useDeleteAdminCompetitionMutation>;
export type DeleteAdminCompetitionMutationResult = Apollo.MutationResult<DeleteAdminCompetitionMutation>;
export type DeleteAdminCompetitionMutationOptions = Apollo.BaseMutationOptions<DeleteAdminCompetitionMutation, DeleteAdminCompetitionMutationVariables>;
export const CreateAdminLeagueDocument = gql`
    mutation CreateAdminLeague($input: CreateLeagueInput!) {
  createLeague(input: $input) {
    id
    name
  }
}
    `;
export type CreateAdminLeagueMutationFn = Apollo.MutationFunction<CreateAdminLeagueMutation, CreateAdminLeagueMutationVariables>;

/**
 * __useCreateAdminLeagueMutation__
 *
 * To run a mutation, you first call `useCreateAdminLeagueMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAdminLeagueMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAdminLeagueMutation, { data, loading, error }] = useCreateAdminLeagueMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateAdminLeagueMutation(baseOptions?: Apollo.MutationHookOptions<CreateAdminLeagueMutation, CreateAdminLeagueMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAdminLeagueMutation, CreateAdminLeagueMutationVariables>(CreateAdminLeagueDocument, options);
      }
export type CreateAdminLeagueMutationHookResult = ReturnType<typeof useCreateAdminLeagueMutation>;
export type CreateAdminLeagueMutationResult = Apollo.MutationResult<CreateAdminLeagueMutation>;
export type CreateAdminLeagueMutationOptions = Apollo.BaseMutationOptions<CreateAdminLeagueMutation, CreateAdminLeagueMutationVariables>;
export const DeleteAdminLeagueDocument = gql`
    mutation DeleteAdminLeague($id: ID!) {
  deleteLeague(id: $id) {
    id
  }
}
    `;
export type DeleteAdminLeagueMutationFn = Apollo.MutationFunction<DeleteAdminLeagueMutation, DeleteAdminLeagueMutationVariables>;

/**
 * __useDeleteAdminLeagueMutation__
 *
 * To run a mutation, you first call `useDeleteAdminLeagueMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAdminLeagueMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAdminLeagueMutation, { data, loading, error }] = useDeleteAdminLeagueMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteAdminLeagueMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAdminLeagueMutation, DeleteAdminLeagueMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAdminLeagueMutation, DeleteAdminLeagueMutationVariables>(DeleteAdminLeagueDocument, options);
      }
export type DeleteAdminLeagueMutationHookResult = ReturnType<typeof useDeleteAdminLeagueMutation>;
export type DeleteAdminLeagueMutationResult = Apollo.MutationResult<DeleteAdminLeagueMutation>;
export type DeleteAdminLeagueMutationOptions = Apollo.BaseMutationOptions<DeleteAdminLeagueMutation, DeleteAdminLeagueMutationVariables>;
export const UpdateAdminLeagueRuleDocument = gql`
    mutation UpdateAdminLeagueRule($id: ID!, $input: UpdateLeagueRuleInput!) {
  updateLeagueRule(id: $id, input: $input) {
    id
    name
  }
}
    `;
export type UpdateAdminLeagueRuleMutationFn = Apollo.MutationFunction<UpdateAdminLeagueRuleMutation, UpdateAdminLeagueRuleMutationVariables>;

/**
 * __useUpdateAdminLeagueRuleMutation__
 *
 * To run a mutation, you first call `useUpdateAdminLeagueRuleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAdminLeagueRuleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAdminLeagueRuleMutation, { data, loading, error }] = useUpdateAdminLeagueRuleMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateAdminLeagueRuleMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAdminLeagueRuleMutation, UpdateAdminLeagueRuleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAdminLeagueRuleMutation, UpdateAdminLeagueRuleMutationVariables>(UpdateAdminLeagueRuleDocument, options);
      }
export type UpdateAdminLeagueRuleMutationHookResult = ReturnType<typeof useUpdateAdminLeagueRuleMutation>;
export type UpdateAdminLeagueRuleMutationResult = Apollo.MutationResult<UpdateAdminLeagueRuleMutation>;
export type UpdateAdminLeagueRuleMutationOptions = Apollo.BaseMutationOptions<UpdateAdminLeagueRuleMutation, UpdateAdminLeagueRuleMutationVariables>;
export const GenerateAdminRoundRobinDocument = gql`
    mutation GenerateAdminRoundRobin($id: ID!, $input: GenerateRoundRobinInput!) {
  generateRoundRobin(id: $id, input: $input) {
    id
  }
}
    `;
export type GenerateAdminRoundRobinMutationFn = Apollo.MutationFunction<GenerateAdminRoundRobinMutation, GenerateAdminRoundRobinMutationVariables>;

/**
 * __useGenerateAdminRoundRobinMutation__
 *
 * To run a mutation, you first call `useGenerateAdminRoundRobinMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGenerateAdminRoundRobinMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [generateAdminRoundRobinMutation, { data, loading, error }] = useGenerateAdminRoundRobinMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGenerateAdminRoundRobinMutation(baseOptions?: Apollo.MutationHookOptions<GenerateAdminRoundRobinMutation, GenerateAdminRoundRobinMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GenerateAdminRoundRobinMutation, GenerateAdminRoundRobinMutationVariables>(GenerateAdminRoundRobinDocument, options);
      }
export type GenerateAdminRoundRobinMutationHookResult = ReturnType<typeof useGenerateAdminRoundRobinMutation>;
export type GenerateAdminRoundRobinMutationResult = Apollo.MutationResult<GenerateAdminRoundRobinMutation>;
export type GenerateAdminRoundRobinMutationOptions = Apollo.BaseMutationOptions<GenerateAdminRoundRobinMutation, GenerateAdminRoundRobinMutationVariables>;
export const CreateAdminTournamentDocument = gql`
    mutation CreateAdminTournament($input: CreateTournamentInput!) {
  createTournament(input: $input) {
    id
    name
    bracketType
  }
}
    `;
export type CreateAdminTournamentMutationFn = Apollo.MutationFunction<CreateAdminTournamentMutation, CreateAdminTournamentMutationVariables>;

/**
 * __useCreateAdminTournamentMutation__
 *
 * To run a mutation, you first call `useCreateAdminTournamentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAdminTournamentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAdminTournamentMutation, { data, loading, error }] = useCreateAdminTournamentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateAdminTournamentMutation(baseOptions?: Apollo.MutationHookOptions<CreateAdminTournamentMutation, CreateAdminTournamentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAdminTournamentMutation, CreateAdminTournamentMutationVariables>(CreateAdminTournamentDocument, options);
      }
export type CreateAdminTournamentMutationHookResult = ReturnType<typeof useCreateAdminTournamentMutation>;
export type CreateAdminTournamentMutationResult = Apollo.MutationResult<CreateAdminTournamentMutation>;
export type CreateAdminTournamentMutationOptions = Apollo.BaseMutationOptions<CreateAdminTournamentMutation, CreateAdminTournamentMutationVariables>;
export const GetAdminMatchesDocument = gql`
    query GetAdminMatches {
  matches {
    id
    time
    status
    location {
      id
      name
    }
    competition {
      id
      name
    }
    entries {
      id
      team {
        id
        name
      }
      score
    }
  }
}
    `;

/**
 * __useGetAdminMatchesQuery__
 *
 * To run a query within a React component, call `useGetAdminMatchesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminMatchesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminMatchesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAdminMatchesQuery(baseOptions?: Apollo.QueryHookOptions<GetAdminMatchesQuery, GetAdminMatchesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAdminMatchesQuery, GetAdminMatchesQueryVariables>(GetAdminMatchesDocument, options);
      }
export function useGetAdminMatchesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAdminMatchesQuery, GetAdminMatchesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAdminMatchesQuery, GetAdminMatchesQueryVariables>(GetAdminMatchesDocument, options);
        }
export function useGetAdminMatchesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAdminMatchesQuery, GetAdminMatchesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAdminMatchesQuery, GetAdminMatchesQueryVariables>(GetAdminMatchesDocument, options);
        }
export type GetAdminMatchesQueryHookResult = ReturnType<typeof useGetAdminMatchesQuery>;
export type GetAdminMatchesLazyQueryHookResult = ReturnType<typeof useGetAdminMatchesLazyQuery>;
export type GetAdminMatchesSuspenseQueryHookResult = ReturnType<typeof useGetAdminMatchesSuspenseQuery>;
export type GetAdminMatchesQueryResult = Apollo.QueryResult<GetAdminMatchesQuery, GetAdminMatchesQueryVariables>;
export const GetAdminMatchDocument = gql`
    query GetAdminMatch($id: ID!) {
  match(id: $id) {
    id
    time
    status
    location {
      id
      name
    }
    competition {
      id
      name
    }
    entries {
      id
      team {
        id
        name
      }
      score
    }
  }
}
    `;

/**
 * __useGetAdminMatchQuery__
 *
 * To run a query within a React component, call `useGetAdminMatchQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminMatchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminMatchQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetAdminMatchQuery(baseOptions: Apollo.QueryHookOptions<GetAdminMatchQuery, GetAdminMatchQueryVariables> & ({ variables: GetAdminMatchQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAdminMatchQuery, GetAdminMatchQueryVariables>(GetAdminMatchDocument, options);
      }
export function useGetAdminMatchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAdminMatchQuery, GetAdminMatchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAdminMatchQuery, GetAdminMatchQueryVariables>(GetAdminMatchDocument, options);
        }
export function useGetAdminMatchSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAdminMatchQuery, GetAdminMatchQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAdminMatchQuery, GetAdminMatchQueryVariables>(GetAdminMatchDocument, options);
        }
export type GetAdminMatchQueryHookResult = ReturnType<typeof useGetAdminMatchQuery>;
export type GetAdminMatchLazyQueryHookResult = ReturnType<typeof useGetAdminMatchLazyQuery>;
export type GetAdminMatchSuspenseQueryHookResult = ReturnType<typeof useGetAdminMatchSuspenseQuery>;
export type GetAdminMatchQueryResult = Apollo.QueryResult<GetAdminMatchQuery, GetAdminMatchQueryVariables>;
export const UpdateAdminMatchResultDocument = gql`
    mutation UpdateAdminMatchResult($id: ID!, $input: UpdateMatchResultInput!) {
  updateMatchResult(id: $id, input: $input) {
    id
    status
    entries {
      id
      team {
        id
        name
      }
      score
    }
  }
}
    `;
export type UpdateAdminMatchResultMutationFn = Apollo.MutationFunction<UpdateAdminMatchResultMutation, UpdateAdminMatchResultMutationVariables>;

/**
 * __useUpdateAdminMatchResultMutation__
 *
 * To run a mutation, you first call `useUpdateAdminMatchResultMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAdminMatchResultMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAdminMatchResultMutation, { data, loading, error }] = useUpdateAdminMatchResultMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateAdminMatchResultMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAdminMatchResultMutation, UpdateAdminMatchResultMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAdminMatchResultMutation, UpdateAdminMatchResultMutationVariables>(UpdateAdminMatchResultDocument, options);
      }
export type UpdateAdminMatchResultMutationHookResult = ReturnType<typeof useUpdateAdminMatchResultMutation>;
export type UpdateAdminMatchResultMutationResult = Apollo.MutationResult<UpdateAdminMatchResultMutation>;
export type UpdateAdminMatchResultMutationOptions = Apollo.BaseMutationOptions<UpdateAdminMatchResultMutation, UpdateAdminMatchResultMutationVariables>;
export const UpdateAdminMatchDetailDocument = gql`
    mutation UpdateAdminMatchDetail($id: ID!, $input: UpdateMatchDetailInput!) {
  updateMatchDetail(id: $id, input: $input) {
    id
    time
    location {
      id
      name
    }
  }
}
    `;
export type UpdateAdminMatchDetailMutationFn = Apollo.MutationFunction<UpdateAdminMatchDetailMutation, UpdateAdminMatchDetailMutationVariables>;

/**
 * __useUpdateAdminMatchDetailMutation__
 *
 * To run a mutation, you first call `useUpdateAdminMatchDetailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAdminMatchDetailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAdminMatchDetailMutation, { data, loading, error }] = useUpdateAdminMatchDetailMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateAdminMatchDetailMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAdminMatchDetailMutation, UpdateAdminMatchDetailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAdminMatchDetailMutation, UpdateAdminMatchDetailMutationVariables>(UpdateAdminMatchDetailDocument, options);
      }
export type UpdateAdminMatchDetailMutationHookResult = ReturnType<typeof useUpdateAdminMatchDetailMutation>;
export type UpdateAdminMatchDetailMutationResult = Apollo.MutationResult<UpdateAdminMatchDetailMutation>;
export type UpdateAdminMatchDetailMutationOptions = Apollo.BaseMutationOptions<UpdateAdminMatchDetailMutation, UpdateAdminMatchDetailMutationVariables>;
export const GetAdminTeamsDocument = gql`
    query GetAdminTeams {
  teams {
    id
    name
    group {
      id
      name
    }
    users {
      id
      name
      email
    }
  }
}
    `;

/**
 * __useGetAdminTeamsQuery__
 *
 * To run a query within a React component, call `useGetAdminTeamsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminTeamsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminTeamsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAdminTeamsQuery(baseOptions?: Apollo.QueryHookOptions<GetAdminTeamsQuery, GetAdminTeamsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAdminTeamsQuery, GetAdminTeamsQueryVariables>(GetAdminTeamsDocument, options);
      }
export function useGetAdminTeamsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAdminTeamsQuery, GetAdminTeamsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAdminTeamsQuery, GetAdminTeamsQueryVariables>(GetAdminTeamsDocument, options);
        }
export function useGetAdminTeamsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAdminTeamsQuery, GetAdminTeamsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAdminTeamsQuery, GetAdminTeamsQueryVariables>(GetAdminTeamsDocument, options);
        }
export type GetAdminTeamsQueryHookResult = ReturnType<typeof useGetAdminTeamsQuery>;
export type GetAdminTeamsLazyQueryHookResult = ReturnType<typeof useGetAdminTeamsLazyQuery>;
export type GetAdminTeamsSuspenseQueryHookResult = ReturnType<typeof useGetAdminTeamsSuspenseQuery>;
export type GetAdminTeamsQueryResult = Apollo.QueryResult<GetAdminTeamsQuery, GetAdminTeamsQueryVariables>;
export const GetAdminTeamDocument = gql`
    query GetAdminTeam($id: ID!) {
  team(id: $id) {
    id
    name
    group {
      id
      name
    }
    users {
      id
      name
      email
    }
  }
}
    `;

/**
 * __useGetAdminTeamQuery__
 *
 * To run a query within a React component, call `useGetAdminTeamQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminTeamQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminTeamQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetAdminTeamQuery(baseOptions: Apollo.QueryHookOptions<GetAdminTeamQuery, GetAdminTeamQueryVariables> & ({ variables: GetAdminTeamQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAdminTeamQuery, GetAdminTeamQueryVariables>(GetAdminTeamDocument, options);
      }
export function useGetAdminTeamLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAdminTeamQuery, GetAdminTeamQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAdminTeamQuery, GetAdminTeamQueryVariables>(GetAdminTeamDocument, options);
        }
export function useGetAdminTeamSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAdminTeamQuery, GetAdminTeamQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAdminTeamQuery, GetAdminTeamQueryVariables>(GetAdminTeamDocument, options);
        }
export type GetAdminTeamQueryHookResult = ReturnType<typeof useGetAdminTeamQuery>;
export type GetAdminTeamLazyQueryHookResult = ReturnType<typeof useGetAdminTeamLazyQuery>;
export type GetAdminTeamSuspenseQueryHookResult = ReturnType<typeof useGetAdminTeamSuspenseQuery>;
export type GetAdminTeamQueryResult = Apollo.QueryResult<GetAdminTeamQuery, GetAdminTeamQueryVariables>;
export const CreateAdminTeamDocument = gql`
    mutation CreateAdminTeam($input: CreateTeamInput!) {
  createTeam(input: $input) {
    id
    name
    group {
      id
      name
    }
  }
}
    `;
export type CreateAdminTeamMutationFn = Apollo.MutationFunction<CreateAdminTeamMutation, CreateAdminTeamMutationVariables>;

/**
 * __useCreateAdminTeamMutation__
 *
 * To run a mutation, you first call `useCreateAdminTeamMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAdminTeamMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAdminTeamMutation, { data, loading, error }] = useCreateAdminTeamMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateAdminTeamMutation(baseOptions?: Apollo.MutationHookOptions<CreateAdminTeamMutation, CreateAdminTeamMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAdminTeamMutation, CreateAdminTeamMutationVariables>(CreateAdminTeamDocument, options);
      }
export type CreateAdminTeamMutationHookResult = ReturnType<typeof useCreateAdminTeamMutation>;
export type CreateAdminTeamMutationResult = Apollo.MutationResult<CreateAdminTeamMutation>;
export type CreateAdminTeamMutationOptions = Apollo.BaseMutationOptions<CreateAdminTeamMutation, CreateAdminTeamMutationVariables>;
export const UpdateAdminTeamDocument = gql`
    mutation UpdateAdminTeam($id: ID!, $input: UpdateTeamInput!) {
  updateTeam(id: $id, input: $input) {
    id
    name
    group {
      id
      name
    }
  }
}
    `;
export type UpdateAdminTeamMutationFn = Apollo.MutationFunction<UpdateAdminTeamMutation, UpdateAdminTeamMutationVariables>;

/**
 * __useUpdateAdminTeamMutation__
 *
 * To run a mutation, you first call `useUpdateAdminTeamMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAdminTeamMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAdminTeamMutation, { data, loading, error }] = useUpdateAdminTeamMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateAdminTeamMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAdminTeamMutation, UpdateAdminTeamMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAdminTeamMutation, UpdateAdminTeamMutationVariables>(UpdateAdminTeamDocument, options);
      }
export type UpdateAdminTeamMutationHookResult = ReturnType<typeof useUpdateAdminTeamMutation>;
export type UpdateAdminTeamMutationResult = Apollo.MutationResult<UpdateAdminTeamMutation>;
export type UpdateAdminTeamMutationOptions = Apollo.BaseMutationOptions<UpdateAdminTeamMutation, UpdateAdminTeamMutationVariables>;
export const DeleteAdminTeamDocument = gql`
    mutation DeleteAdminTeam($id: ID!) {
  deleteTeam(id: $id) {
    id
  }
}
    `;
export type DeleteAdminTeamMutationFn = Apollo.MutationFunction<DeleteAdminTeamMutation, DeleteAdminTeamMutationVariables>;

/**
 * __useDeleteAdminTeamMutation__
 *
 * To run a mutation, you first call `useDeleteAdminTeamMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAdminTeamMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAdminTeamMutation, { data, loading, error }] = useDeleteAdminTeamMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteAdminTeamMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAdminTeamMutation, DeleteAdminTeamMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAdminTeamMutation, DeleteAdminTeamMutationVariables>(DeleteAdminTeamDocument, options);
      }
export type DeleteAdminTeamMutationHookResult = ReturnType<typeof useDeleteAdminTeamMutation>;
export type DeleteAdminTeamMutationResult = Apollo.MutationResult<DeleteAdminTeamMutation>;
export type DeleteAdminTeamMutationOptions = Apollo.BaseMutationOptions<DeleteAdminTeamMutation, DeleteAdminTeamMutationVariables>;
export const UpdateAdminTeamUsersDocument = gql`
    mutation UpdateAdminTeamUsers($id: ID!, $input: UpdateTeamUsersInput!) {
  updateTeamUsers(id: $id, input: $input) {
    id
    users {
      id
      name
      email
    }
  }
}
    `;
export type UpdateAdminTeamUsersMutationFn = Apollo.MutationFunction<UpdateAdminTeamUsersMutation, UpdateAdminTeamUsersMutationVariables>;

/**
 * __useUpdateAdminTeamUsersMutation__
 *
 * To run a mutation, you first call `useUpdateAdminTeamUsersMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAdminTeamUsersMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAdminTeamUsersMutation, { data, loading, error }] = useUpdateAdminTeamUsersMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateAdminTeamUsersMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAdminTeamUsersMutation, UpdateAdminTeamUsersMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAdminTeamUsersMutation, UpdateAdminTeamUsersMutationVariables>(UpdateAdminTeamUsersDocument, options);
      }
export type UpdateAdminTeamUsersMutationHookResult = ReturnType<typeof useUpdateAdminTeamUsersMutation>;
export type UpdateAdminTeamUsersMutationResult = Apollo.MutationResult<UpdateAdminTeamUsersMutation>;
export type UpdateAdminTeamUsersMutationOptions = Apollo.BaseMutationOptions<UpdateAdminTeamUsersMutation, UpdateAdminTeamUsersMutationVariables>;
export const GetAdminAllUsersForTeamsDocument = gql`
    query GetAdminAllUsersForTeams {
  users {
    id
    name
    email
    groups {
      id
      name
    }
  }
}
    `;

/**
 * __useGetAdminAllUsersForTeamsQuery__
 *
 * To run a query within a React component, call `useGetAdminAllUsersForTeamsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminAllUsersForTeamsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminAllUsersForTeamsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAdminAllUsersForTeamsQuery(baseOptions?: Apollo.QueryHookOptions<GetAdminAllUsersForTeamsQuery, GetAdminAllUsersForTeamsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAdminAllUsersForTeamsQuery, GetAdminAllUsersForTeamsQueryVariables>(GetAdminAllUsersForTeamsDocument, options);
      }
export function useGetAdminAllUsersForTeamsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAdminAllUsersForTeamsQuery, GetAdminAllUsersForTeamsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAdminAllUsersForTeamsQuery, GetAdminAllUsersForTeamsQueryVariables>(GetAdminAllUsersForTeamsDocument, options);
        }
export function useGetAdminAllUsersForTeamsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAdminAllUsersForTeamsQuery, GetAdminAllUsersForTeamsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAdminAllUsersForTeamsQuery, GetAdminAllUsersForTeamsQueryVariables>(GetAdminAllUsersForTeamsDocument, options);
        }
export type GetAdminAllUsersForTeamsQueryHookResult = ReturnType<typeof useGetAdminAllUsersForTeamsQuery>;
export type GetAdminAllUsersForTeamsLazyQueryHookResult = ReturnType<typeof useGetAdminAllUsersForTeamsLazyQuery>;
export type GetAdminAllUsersForTeamsSuspenseQueryHookResult = ReturnType<typeof useGetAdminAllUsersForTeamsSuspenseQuery>;
export type GetAdminAllUsersForTeamsQueryResult = Apollo.QueryResult<GetAdminAllUsersForTeamsQuery, GetAdminAllUsersForTeamsQueryVariables>;
export const GetAdminUsersDocument = gql`
    query GetAdminUsers {
  users {
    id
    name
    email
    groups {
      id
      name
    }
    teams {
      id
      name
    }
  }
}
    `;

/**
 * __useGetAdminUsersQuery__
 *
 * To run a query within a React component, call `useGetAdminUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAdminUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetAdminUsersQuery, GetAdminUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAdminUsersQuery, GetAdminUsersQueryVariables>(GetAdminUsersDocument, options);
      }
export function useGetAdminUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAdminUsersQuery, GetAdminUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAdminUsersQuery, GetAdminUsersQueryVariables>(GetAdminUsersDocument, options);
        }
export function useGetAdminUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAdminUsersQuery, GetAdminUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAdminUsersQuery, GetAdminUsersQueryVariables>(GetAdminUsersDocument, options);
        }
export type GetAdminUsersQueryHookResult = ReturnType<typeof useGetAdminUsersQuery>;
export type GetAdminUsersLazyQueryHookResult = ReturnType<typeof useGetAdminUsersLazyQuery>;
export type GetAdminUsersSuspenseQueryHookResult = ReturnType<typeof useGetAdminUsersSuspenseQuery>;
export type GetAdminUsersQueryResult = Apollo.QueryResult<GetAdminUsersQuery, GetAdminUsersQueryVariables>;
export const GetAdminUserDocument = gql`
    query GetAdminUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
    groups {
      id
      name
    }
    teams {
      id
      name
    }
  }
}
    `;

/**
 * __useGetAdminUserQuery__
 *
 * To run a query within a React component, call `useGetAdminUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetAdminUserQuery(baseOptions: Apollo.QueryHookOptions<GetAdminUserQuery, GetAdminUserQueryVariables> & ({ variables: GetAdminUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAdminUserQuery, GetAdminUserQueryVariables>(GetAdminUserDocument, options);
      }
export function useGetAdminUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAdminUserQuery, GetAdminUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAdminUserQuery, GetAdminUserQueryVariables>(GetAdminUserDocument, options);
        }
export function useGetAdminUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAdminUserQuery, GetAdminUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAdminUserQuery, GetAdminUserQueryVariables>(GetAdminUserDocument, options);
        }
export type GetAdminUserQueryHookResult = ReturnType<typeof useGetAdminUserQuery>;
export type GetAdminUserLazyQueryHookResult = ReturnType<typeof useGetAdminUserLazyQuery>;
export type GetAdminUserSuspenseQueryHookResult = ReturnType<typeof useGetAdminUserSuspenseQuery>;
export type GetAdminUserQueryResult = Apollo.QueryResult<GetAdminUserQuery, GetAdminUserQueryVariables>;
export const CreateAdminUserDocument = gql`
    mutation CreateAdminUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    name
    email
  }
}
    `;
export type CreateAdminUserMutationFn = Apollo.MutationFunction<CreateAdminUserMutation, CreateAdminUserMutationVariables>;

/**
 * __useCreateAdminUserMutation__
 *
 * To run a mutation, you first call `useCreateAdminUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAdminUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAdminUserMutation, { data, loading, error }] = useCreateAdminUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateAdminUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateAdminUserMutation, CreateAdminUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAdminUserMutation, CreateAdminUserMutationVariables>(CreateAdminUserDocument, options);
      }
export type CreateAdminUserMutationHookResult = ReturnType<typeof useCreateAdminUserMutation>;
export type CreateAdminUserMutationResult = Apollo.MutationResult<CreateAdminUserMutation>;
export type CreateAdminUserMutationOptions = Apollo.BaseMutationOptions<CreateAdminUserMutation, CreateAdminUserMutationVariables>;