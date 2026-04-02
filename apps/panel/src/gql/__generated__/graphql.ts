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

export type GetPanelGroupsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPanelGroupsQuery = { __typename?: 'Query', groups: Array<{ __typename?: 'Group', id: string, name: string }> };

export type GetPanelGroupQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPanelGroupQuery = { __typename?: 'Query', group: { __typename?: 'Group', id: string, name: string, users: Array<{ __typename?: 'User', id: string, name: string, email: string }>, teams: Array<{ __typename?: 'Team', id: string, name: string }> } };

export type GetPanelCompetitionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPanelCompetitionsQuery = { __typename?: 'Query', competitions: Array<{ __typename?: 'Competition', id: string, name: string, type: CompetitionType, scene: { __typename?: 'Scene', id: string, name: string }, teams: Array<{ __typename?: 'Team', id: string }> }> };

export type GetPanelCompetitionQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPanelCompetitionQuery = { __typename?: 'Query', competition: { __typename?: 'Competition', id: string, name: string, type: CompetitionType, scene: { __typename?: 'Scene', id: string, name: string }, teams: Array<{ __typename?: 'Team', id: string, name: string }>, matches: Array<{ __typename?: 'Match', id: string, time: string, status: MatchStatus, location?: { __typename?: 'Location', id: string, name: string } | null, entries: Array<{ __typename?: 'MatchEntry', id: string, score: number, team?: { __typename?: 'Team', id: string, name: string } | null }> }> } };

export type GetPanelImagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPanelImagesQuery = { __typename?: 'Query', images: Array<{ __typename?: 'Image', id: string, url?: string | null, status: string }> };

export type GetPanelImageQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPanelImageQuery = { __typename?: 'Query', image: { __typename?: 'Image', id: string, url?: string | null, status: string } };

export type GetPanelInformationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPanelInformationsQuery = { __typename?: 'Query', Informations: Array<{ __typename?: 'Information', id: string, title: string, content: string }> };

export type GetPanelInformationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPanelInformationQuery = { __typename?: 'Query', Information: { __typename?: 'Information', id: string, title: string, content: string } };

export type GetPanelLocationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPanelLocationsQuery = { __typename?: 'Query', locations: Array<{ __typename?: 'Location', id: string, name: string }> };

export type GetPanelLocationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPanelLocationQuery = { __typename?: 'Query', location: { __typename?: 'Location', id: string, name: string } };

export type GetPanelMatchesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPanelMatchesQuery = { __typename?: 'Query', matches: Array<{ __typename?: 'Match', id: string, time: string, status: MatchStatus, location?: { __typename?: 'Location', id: string, name: string } | null, competition: { __typename?: 'Competition', id: string, name: string, scene: { __typename?: 'Scene', id: string } }, winnerTeam?: { __typename?: 'Team', id: string, name: string } | null, entries: Array<{ __typename?: 'MatchEntry', id: string, score: number, team?: { __typename?: 'Team', id: string, name: string } | null }>, judgment?: { __typename?: 'Judgment', team?: { __typename?: 'Team', id: string } | null } | null }> };

export type GetPanelMatchQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPanelMatchQuery = { __typename?: 'Query', match: { __typename?: 'Match', id: string, time: string, status: MatchStatus, location?: { __typename?: 'Location', id: string, name: string } | null, competition: { __typename?: 'Competition', id: string, name: string, scene: { __typename?: 'Scene', id: string } }, winnerTeam?: { __typename?: 'Team', id: string, name: string } | null, entries: Array<{ __typename?: 'MatchEntry', id: string, score: number, team?: { __typename?: 'Team', id: string, name: string } | null }>, judgment?: { __typename?: 'Judgment', id: string, name?: string | null, user?: { __typename?: 'User', id: string, name: string } | null, team?: { __typename?: 'Team', id: string, name: string } | null } | null } };

export type GetPanelSportsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPanelSportsQuery = { __typename?: 'Query', sports: Array<{ __typename?: 'Sport', id: string, name: string, weight: number, image?: { __typename?: 'Image', id: string, url?: string | null } | null, scene?: Array<{ __typename?: 'SportScene', id: string, scene: { __typename?: 'Scene', id: string, name: string } }> | null }> };

export type GetPanelSportQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPanelSportQuery = { __typename?: 'Query', sport: { __typename?: 'Sport', id: string, name: string, weight: number, rules: Array<{ __typename?: 'Rule', id?: string | null, rule: string }>, image?: { __typename?: 'Image', id: string, url?: string | null } | null, scene?: Array<{ __typename?: 'SportScene', id: string, sport: { __typename?: 'Sport', id: string }, scene: { __typename?: 'Scene', id: string, name: string }, entries: Array<{ __typename?: 'SportEntry', id: string, team: { __typename?: 'Team', id: string, name: string } }> }> | null } };

export type GetPanelSportCompetitionsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPanelSportCompetitionsQuery = { __typename?: 'Query', sport: { __typename?: 'Sport', id: string, scene?: Array<{ __typename?: 'SportScene', id: string, scene: { __typename?: 'Scene', id: string, name: string, sportScenes: Array<{ __typename?: 'SportScene', id: string }> }, entries: Array<{ __typename?: 'SportEntry', id: string, team: { __typename?: 'Team', id: string, name: string } }> }> | null } };

export type GetPanelScenesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPanelScenesQuery = { __typename?: 'Query', scenes: Array<{ __typename?: 'Scene', id: string, name: string }> };

export type GetPanelSceneQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPanelSceneQuery = { __typename?: 'Query', scene: { __typename?: 'Scene', id: string, name: string } };

export type GetPanelTeamsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPanelTeamsQuery = { __typename?: 'Query', teams: Array<{ __typename?: 'Team', id: string, name: string, group: { __typename?: 'Group', id: string, name: string }, users: Array<{ __typename?: 'User', id: string, name: string }> }> };

export type GetPanelTeamQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPanelTeamQuery = { __typename?: 'Query', team: { __typename?: 'Team', id: string, name: string, group: { __typename?: 'Group', id: string, name: string }, users: Array<{ __typename?: 'User', id: string, name: string, email: string }> } };

export type GetPanelMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPanelMeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, name: string, email: string, groups: Array<{ __typename?: 'Group', id: string, name: string }>, teams: Array<{ __typename?: 'Team', id: string, name: string }> } };

export type GetPanelUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPanelUsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, name: string, email: string, teams: Array<{ __typename?: 'Team', id: string, name: string }> }> };

export type GetPanelUserQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPanelUserQuery = { __typename?: 'Query', user: { __typename?: 'User', id: string, name: string, email: string, groups: Array<{ __typename?: 'Group', id: string, name: string }>, teams: Array<{ __typename?: 'Team', id: string, name: string }> } };


export const GetPanelGroupsDocument = gql`
    query GetPanelGroups {
  groups {
    id
    name
  }
}
    `;

/**
 * __useGetPanelGroupsQuery__
 *
 * To run a query within a React component, call `useGetPanelGroupsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPanelGroupsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPanelGroupsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPanelGroupsQuery(baseOptions?: Apollo.QueryHookOptions<GetPanelGroupsQuery, GetPanelGroupsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPanelGroupsQuery, GetPanelGroupsQueryVariables>(GetPanelGroupsDocument, options);
      }
export function useGetPanelGroupsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPanelGroupsQuery, GetPanelGroupsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPanelGroupsQuery, GetPanelGroupsQueryVariables>(GetPanelGroupsDocument, options);
        }
export function useGetPanelGroupsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPanelGroupsQuery, GetPanelGroupsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPanelGroupsQuery, GetPanelGroupsQueryVariables>(GetPanelGroupsDocument, options);
        }
export type GetPanelGroupsQueryHookResult = ReturnType<typeof useGetPanelGroupsQuery>;
export type GetPanelGroupsLazyQueryHookResult = ReturnType<typeof useGetPanelGroupsLazyQuery>;
export type GetPanelGroupsSuspenseQueryHookResult = ReturnType<typeof useGetPanelGroupsSuspenseQuery>;
export type GetPanelGroupsQueryResult = Apollo.QueryResult<GetPanelGroupsQuery, GetPanelGroupsQueryVariables>;
export const GetPanelGroupDocument = gql`
    query GetPanelGroup($id: ID!) {
  group(id: $id) {
    id
    name
    users {
      id
      name
      email
    }
    teams {
      id
      name
    }
  }
}
    `;

/**
 * __useGetPanelGroupQuery__
 *
 * To run a query within a React component, call `useGetPanelGroupQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPanelGroupQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPanelGroupQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPanelGroupQuery(baseOptions: Apollo.QueryHookOptions<GetPanelGroupQuery, GetPanelGroupQueryVariables> & ({ variables: GetPanelGroupQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPanelGroupQuery, GetPanelGroupQueryVariables>(GetPanelGroupDocument, options);
      }
export function useGetPanelGroupLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPanelGroupQuery, GetPanelGroupQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPanelGroupQuery, GetPanelGroupQueryVariables>(GetPanelGroupDocument, options);
        }
export function useGetPanelGroupSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPanelGroupQuery, GetPanelGroupQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPanelGroupQuery, GetPanelGroupQueryVariables>(GetPanelGroupDocument, options);
        }
export type GetPanelGroupQueryHookResult = ReturnType<typeof useGetPanelGroupQuery>;
export type GetPanelGroupLazyQueryHookResult = ReturnType<typeof useGetPanelGroupLazyQuery>;
export type GetPanelGroupSuspenseQueryHookResult = ReturnType<typeof useGetPanelGroupSuspenseQuery>;
export type GetPanelGroupQueryResult = Apollo.QueryResult<GetPanelGroupQuery, GetPanelGroupQueryVariables>;
export const GetPanelCompetitionsDocument = gql`
    query GetPanelCompetitions {
  competitions {
    id
    name
    type
    scene {
      id
      name
    }
    teams {
      id
    }
  }
}
    `;

/**
 * __useGetPanelCompetitionsQuery__
 *
 * To run a query within a React component, call `useGetPanelCompetitionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPanelCompetitionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPanelCompetitionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPanelCompetitionsQuery(baseOptions?: Apollo.QueryHookOptions<GetPanelCompetitionsQuery, GetPanelCompetitionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPanelCompetitionsQuery, GetPanelCompetitionsQueryVariables>(GetPanelCompetitionsDocument, options);
      }
export function useGetPanelCompetitionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPanelCompetitionsQuery, GetPanelCompetitionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPanelCompetitionsQuery, GetPanelCompetitionsQueryVariables>(GetPanelCompetitionsDocument, options);
        }
export function useGetPanelCompetitionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPanelCompetitionsQuery, GetPanelCompetitionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPanelCompetitionsQuery, GetPanelCompetitionsQueryVariables>(GetPanelCompetitionsDocument, options);
        }
export type GetPanelCompetitionsQueryHookResult = ReturnType<typeof useGetPanelCompetitionsQuery>;
export type GetPanelCompetitionsLazyQueryHookResult = ReturnType<typeof useGetPanelCompetitionsLazyQuery>;
export type GetPanelCompetitionsSuspenseQueryHookResult = ReturnType<typeof useGetPanelCompetitionsSuspenseQuery>;
export type GetPanelCompetitionsQueryResult = Apollo.QueryResult<GetPanelCompetitionsQuery, GetPanelCompetitionsQueryVariables>;
export const GetPanelCompetitionDocument = gql`
    query GetPanelCompetition($id: ID!) {
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
    }
    matches {
      id
      time
      status
      location {
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
}
    `;

/**
 * __useGetPanelCompetitionQuery__
 *
 * To run a query within a React component, call `useGetPanelCompetitionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPanelCompetitionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPanelCompetitionQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPanelCompetitionQuery(baseOptions: Apollo.QueryHookOptions<GetPanelCompetitionQuery, GetPanelCompetitionQueryVariables> & ({ variables: GetPanelCompetitionQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPanelCompetitionQuery, GetPanelCompetitionQueryVariables>(GetPanelCompetitionDocument, options);
      }
export function useGetPanelCompetitionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPanelCompetitionQuery, GetPanelCompetitionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPanelCompetitionQuery, GetPanelCompetitionQueryVariables>(GetPanelCompetitionDocument, options);
        }
export function useGetPanelCompetitionSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPanelCompetitionQuery, GetPanelCompetitionQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPanelCompetitionQuery, GetPanelCompetitionQueryVariables>(GetPanelCompetitionDocument, options);
        }
export type GetPanelCompetitionQueryHookResult = ReturnType<typeof useGetPanelCompetitionQuery>;
export type GetPanelCompetitionLazyQueryHookResult = ReturnType<typeof useGetPanelCompetitionLazyQuery>;
export type GetPanelCompetitionSuspenseQueryHookResult = ReturnType<typeof useGetPanelCompetitionSuspenseQuery>;
export type GetPanelCompetitionQueryResult = Apollo.QueryResult<GetPanelCompetitionQuery, GetPanelCompetitionQueryVariables>;
export const GetPanelImagesDocument = gql`
    query GetPanelImages {
  images {
    id
    url
    status
  }
}
    `;

/**
 * __useGetPanelImagesQuery__
 *
 * To run a query within a React component, call `useGetPanelImagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPanelImagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPanelImagesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPanelImagesQuery(baseOptions?: Apollo.QueryHookOptions<GetPanelImagesQuery, GetPanelImagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPanelImagesQuery, GetPanelImagesQueryVariables>(GetPanelImagesDocument, options);
      }
export function useGetPanelImagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPanelImagesQuery, GetPanelImagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPanelImagesQuery, GetPanelImagesQueryVariables>(GetPanelImagesDocument, options);
        }
export function useGetPanelImagesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPanelImagesQuery, GetPanelImagesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPanelImagesQuery, GetPanelImagesQueryVariables>(GetPanelImagesDocument, options);
        }
export type GetPanelImagesQueryHookResult = ReturnType<typeof useGetPanelImagesQuery>;
export type GetPanelImagesLazyQueryHookResult = ReturnType<typeof useGetPanelImagesLazyQuery>;
export type GetPanelImagesSuspenseQueryHookResult = ReturnType<typeof useGetPanelImagesSuspenseQuery>;
export type GetPanelImagesQueryResult = Apollo.QueryResult<GetPanelImagesQuery, GetPanelImagesQueryVariables>;
export const GetPanelImageDocument = gql`
    query GetPanelImage($id: ID!) {
  image(id: $id) {
    id
    url
    status
  }
}
    `;

/**
 * __useGetPanelImageQuery__
 *
 * To run a query within a React component, call `useGetPanelImageQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPanelImageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPanelImageQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPanelImageQuery(baseOptions: Apollo.QueryHookOptions<GetPanelImageQuery, GetPanelImageQueryVariables> & ({ variables: GetPanelImageQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPanelImageQuery, GetPanelImageQueryVariables>(GetPanelImageDocument, options);
      }
export function useGetPanelImageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPanelImageQuery, GetPanelImageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPanelImageQuery, GetPanelImageQueryVariables>(GetPanelImageDocument, options);
        }
export function useGetPanelImageSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPanelImageQuery, GetPanelImageQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPanelImageQuery, GetPanelImageQueryVariables>(GetPanelImageDocument, options);
        }
export type GetPanelImageQueryHookResult = ReturnType<typeof useGetPanelImageQuery>;
export type GetPanelImageLazyQueryHookResult = ReturnType<typeof useGetPanelImageLazyQuery>;
export type GetPanelImageSuspenseQueryHookResult = ReturnType<typeof useGetPanelImageSuspenseQuery>;
export type GetPanelImageQueryResult = Apollo.QueryResult<GetPanelImageQuery, GetPanelImageQueryVariables>;
export const GetPanelInformationsDocument = gql`
    query GetPanelInformations {
  Informations {
    id
    title
    content
  }
}
    `;

/**
 * __useGetPanelInformationsQuery__
 *
 * To run a query within a React component, call `useGetPanelInformationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPanelInformationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPanelInformationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPanelInformationsQuery(baseOptions?: Apollo.QueryHookOptions<GetPanelInformationsQuery, GetPanelInformationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPanelInformationsQuery, GetPanelInformationsQueryVariables>(GetPanelInformationsDocument, options);
      }
export function useGetPanelInformationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPanelInformationsQuery, GetPanelInformationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPanelInformationsQuery, GetPanelInformationsQueryVariables>(GetPanelInformationsDocument, options);
        }
export function useGetPanelInformationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPanelInformationsQuery, GetPanelInformationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPanelInformationsQuery, GetPanelInformationsQueryVariables>(GetPanelInformationsDocument, options);
        }
export type GetPanelInformationsQueryHookResult = ReturnType<typeof useGetPanelInformationsQuery>;
export type GetPanelInformationsLazyQueryHookResult = ReturnType<typeof useGetPanelInformationsLazyQuery>;
export type GetPanelInformationsSuspenseQueryHookResult = ReturnType<typeof useGetPanelInformationsSuspenseQuery>;
export type GetPanelInformationsQueryResult = Apollo.QueryResult<GetPanelInformationsQuery, GetPanelInformationsQueryVariables>;
export const GetPanelInformationDocument = gql`
    query GetPanelInformation($id: ID!) {
  Information(id: $id) {
    id
    title
    content
  }
}
    `;

/**
 * __useGetPanelInformationQuery__
 *
 * To run a query within a React component, call `useGetPanelInformationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPanelInformationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPanelInformationQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPanelInformationQuery(baseOptions: Apollo.QueryHookOptions<GetPanelInformationQuery, GetPanelInformationQueryVariables> & ({ variables: GetPanelInformationQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPanelInformationQuery, GetPanelInformationQueryVariables>(GetPanelInformationDocument, options);
      }
export function useGetPanelInformationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPanelInformationQuery, GetPanelInformationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPanelInformationQuery, GetPanelInformationQueryVariables>(GetPanelInformationDocument, options);
        }
export function useGetPanelInformationSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPanelInformationQuery, GetPanelInformationQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPanelInformationQuery, GetPanelInformationQueryVariables>(GetPanelInformationDocument, options);
        }
export type GetPanelInformationQueryHookResult = ReturnType<typeof useGetPanelInformationQuery>;
export type GetPanelInformationLazyQueryHookResult = ReturnType<typeof useGetPanelInformationLazyQuery>;
export type GetPanelInformationSuspenseQueryHookResult = ReturnType<typeof useGetPanelInformationSuspenseQuery>;
export type GetPanelInformationQueryResult = Apollo.QueryResult<GetPanelInformationQuery, GetPanelInformationQueryVariables>;
export const GetPanelLocationsDocument = gql`
    query GetPanelLocations {
  locations {
    id
    name
  }
}
    `;

/**
 * __useGetPanelLocationsQuery__
 *
 * To run a query within a React component, call `useGetPanelLocationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPanelLocationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPanelLocationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPanelLocationsQuery(baseOptions?: Apollo.QueryHookOptions<GetPanelLocationsQuery, GetPanelLocationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPanelLocationsQuery, GetPanelLocationsQueryVariables>(GetPanelLocationsDocument, options);
      }
export function useGetPanelLocationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPanelLocationsQuery, GetPanelLocationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPanelLocationsQuery, GetPanelLocationsQueryVariables>(GetPanelLocationsDocument, options);
        }
export function useGetPanelLocationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPanelLocationsQuery, GetPanelLocationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPanelLocationsQuery, GetPanelLocationsQueryVariables>(GetPanelLocationsDocument, options);
        }
export type GetPanelLocationsQueryHookResult = ReturnType<typeof useGetPanelLocationsQuery>;
export type GetPanelLocationsLazyQueryHookResult = ReturnType<typeof useGetPanelLocationsLazyQuery>;
export type GetPanelLocationsSuspenseQueryHookResult = ReturnType<typeof useGetPanelLocationsSuspenseQuery>;
export type GetPanelLocationsQueryResult = Apollo.QueryResult<GetPanelLocationsQuery, GetPanelLocationsQueryVariables>;
export const GetPanelLocationDocument = gql`
    query GetPanelLocation($id: ID!) {
  location(id: $id) {
    id
    name
  }
}
    `;

/**
 * __useGetPanelLocationQuery__
 *
 * To run a query within a React component, call `useGetPanelLocationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPanelLocationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPanelLocationQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPanelLocationQuery(baseOptions: Apollo.QueryHookOptions<GetPanelLocationQuery, GetPanelLocationQueryVariables> & ({ variables: GetPanelLocationQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPanelLocationQuery, GetPanelLocationQueryVariables>(GetPanelLocationDocument, options);
      }
export function useGetPanelLocationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPanelLocationQuery, GetPanelLocationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPanelLocationQuery, GetPanelLocationQueryVariables>(GetPanelLocationDocument, options);
        }
export function useGetPanelLocationSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPanelLocationQuery, GetPanelLocationQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPanelLocationQuery, GetPanelLocationQueryVariables>(GetPanelLocationDocument, options);
        }
export type GetPanelLocationQueryHookResult = ReturnType<typeof useGetPanelLocationQuery>;
export type GetPanelLocationLazyQueryHookResult = ReturnType<typeof useGetPanelLocationLazyQuery>;
export type GetPanelLocationSuspenseQueryHookResult = ReturnType<typeof useGetPanelLocationSuspenseQuery>;
export type GetPanelLocationQueryResult = Apollo.QueryResult<GetPanelLocationQuery, GetPanelLocationQueryVariables>;
export const GetPanelMatchesDocument = gql`
    query GetPanelMatches {
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
      scene {
        id
      }
    }
    winnerTeam {
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
    judgment {
      team {
        id
      }
    }
  }
}
    `;

/**
 * __useGetPanelMatchesQuery__
 *
 * To run a query within a React component, call `useGetPanelMatchesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPanelMatchesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPanelMatchesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPanelMatchesQuery(baseOptions?: Apollo.QueryHookOptions<GetPanelMatchesQuery, GetPanelMatchesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPanelMatchesQuery, GetPanelMatchesQueryVariables>(GetPanelMatchesDocument, options);
      }
export function useGetPanelMatchesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPanelMatchesQuery, GetPanelMatchesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPanelMatchesQuery, GetPanelMatchesQueryVariables>(GetPanelMatchesDocument, options);
        }
export function useGetPanelMatchesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPanelMatchesQuery, GetPanelMatchesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPanelMatchesQuery, GetPanelMatchesQueryVariables>(GetPanelMatchesDocument, options);
        }
export type GetPanelMatchesQueryHookResult = ReturnType<typeof useGetPanelMatchesQuery>;
export type GetPanelMatchesLazyQueryHookResult = ReturnType<typeof useGetPanelMatchesLazyQuery>;
export type GetPanelMatchesSuspenseQueryHookResult = ReturnType<typeof useGetPanelMatchesSuspenseQuery>;
export type GetPanelMatchesQueryResult = Apollo.QueryResult<GetPanelMatchesQuery, GetPanelMatchesQueryVariables>;
export const GetPanelMatchDocument = gql`
    query GetPanelMatch($id: ID!) {
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
      scene {
        id
      }
    }
    winnerTeam {
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
    judgment {
      id
      name
      user {
        id
        name
      }
      team {
        id
        name
      }
    }
  }
}
    `;

/**
 * __useGetPanelMatchQuery__
 *
 * To run a query within a React component, call `useGetPanelMatchQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPanelMatchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPanelMatchQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPanelMatchQuery(baseOptions: Apollo.QueryHookOptions<GetPanelMatchQuery, GetPanelMatchQueryVariables> & ({ variables: GetPanelMatchQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPanelMatchQuery, GetPanelMatchQueryVariables>(GetPanelMatchDocument, options);
      }
export function useGetPanelMatchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPanelMatchQuery, GetPanelMatchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPanelMatchQuery, GetPanelMatchQueryVariables>(GetPanelMatchDocument, options);
        }
export function useGetPanelMatchSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPanelMatchQuery, GetPanelMatchQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPanelMatchQuery, GetPanelMatchQueryVariables>(GetPanelMatchDocument, options);
        }
export type GetPanelMatchQueryHookResult = ReturnType<typeof useGetPanelMatchQuery>;
export type GetPanelMatchLazyQueryHookResult = ReturnType<typeof useGetPanelMatchLazyQuery>;
export type GetPanelMatchSuspenseQueryHookResult = ReturnType<typeof useGetPanelMatchSuspenseQuery>;
export type GetPanelMatchQueryResult = Apollo.QueryResult<GetPanelMatchQuery, GetPanelMatchQueryVariables>;
export const GetPanelSportsDocument = gql`
    query GetPanelSports {
  sports {
    id
    name
    weight
    image {
      id
      url
    }
    scene {
      id
      scene {
        id
        name
      }
    }
  }
}
    `;

/**
 * __useGetPanelSportsQuery__
 *
 * To run a query within a React component, call `useGetPanelSportsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPanelSportsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPanelSportsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPanelSportsQuery(baseOptions?: Apollo.QueryHookOptions<GetPanelSportsQuery, GetPanelSportsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPanelSportsQuery, GetPanelSportsQueryVariables>(GetPanelSportsDocument, options);
      }
export function useGetPanelSportsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPanelSportsQuery, GetPanelSportsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPanelSportsQuery, GetPanelSportsQueryVariables>(GetPanelSportsDocument, options);
        }
export function useGetPanelSportsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPanelSportsQuery, GetPanelSportsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPanelSportsQuery, GetPanelSportsQueryVariables>(GetPanelSportsDocument, options);
        }
export type GetPanelSportsQueryHookResult = ReturnType<typeof useGetPanelSportsQuery>;
export type GetPanelSportsLazyQueryHookResult = ReturnType<typeof useGetPanelSportsLazyQuery>;
export type GetPanelSportsSuspenseQueryHookResult = ReturnType<typeof useGetPanelSportsSuspenseQuery>;
export type GetPanelSportsQueryResult = Apollo.QueryResult<GetPanelSportsQuery, GetPanelSportsQueryVariables>;
export const GetPanelSportDocument = gql`
    query GetPanelSport($id: ID!) {
  sport(id: $id) {
    id
    name
    weight
    rules {
      id
      rule
    }
    image {
      id
      url
    }
    scene {
      id
      sport {
        id
      }
      scene {
        id
        name
      }
      entries {
        id
        team {
          id
          name
        }
      }
    }
  }
}
    `;

/**
 * __useGetPanelSportQuery__
 *
 * To run a query within a React component, call `useGetPanelSportQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPanelSportQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPanelSportQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPanelSportQuery(baseOptions: Apollo.QueryHookOptions<GetPanelSportQuery, GetPanelSportQueryVariables> & ({ variables: GetPanelSportQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPanelSportQuery, GetPanelSportQueryVariables>(GetPanelSportDocument, options);
      }
export function useGetPanelSportLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPanelSportQuery, GetPanelSportQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPanelSportQuery, GetPanelSportQueryVariables>(GetPanelSportDocument, options);
        }
export function useGetPanelSportSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPanelSportQuery, GetPanelSportQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPanelSportQuery, GetPanelSportQueryVariables>(GetPanelSportDocument, options);
        }
export type GetPanelSportQueryHookResult = ReturnType<typeof useGetPanelSportQuery>;
export type GetPanelSportLazyQueryHookResult = ReturnType<typeof useGetPanelSportLazyQuery>;
export type GetPanelSportSuspenseQueryHookResult = ReturnType<typeof useGetPanelSportSuspenseQuery>;
export type GetPanelSportQueryResult = Apollo.QueryResult<GetPanelSportQuery, GetPanelSportQueryVariables>;
export const GetPanelSportCompetitionsDocument = gql`
    query GetPanelSportCompetitions($id: ID!) {
  sport(id: $id) {
    id
    scene {
      id
      scene {
        id
        name
        sportScenes {
          id
        }
      }
      entries {
        id
        team {
          id
          name
        }
      }
    }
  }
}
    `;

/**
 * __useGetPanelSportCompetitionsQuery__
 *
 * To run a query within a React component, call `useGetPanelSportCompetitionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPanelSportCompetitionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPanelSportCompetitionsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPanelSportCompetitionsQuery(baseOptions: Apollo.QueryHookOptions<GetPanelSportCompetitionsQuery, GetPanelSportCompetitionsQueryVariables> & ({ variables: GetPanelSportCompetitionsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPanelSportCompetitionsQuery, GetPanelSportCompetitionsQueryVariables>(GetPanelSportCompetitionsDocument, options);
      }
export function useGetPanelSportCompetitionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPanelSportCompetitionsQuery, GetPanelSportCompetitionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPanelSportCompetitionsQuery, GetPanelSportCompetitionsQueryVariables>(GetPanelSportCompetitionsDocument, options);
        }
export function useGetPanelSportCompetitionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPanelSportCompetitionsQuery, GetPanelSportCompetitionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPanelSportCompetitionsQuery, GetPanelSportCompetitionsQueryVariables>(GetPanelSportCompetitionsDocument, options);
        }
export type GetPanelSportCompetitionsQueryHookResult = ReturnType<typeof useGetPanelSportCompetitionsQuery>;
export type GetPanelSportCompetitionsLazyQueryHookResult = ReturnType<typeof useGetPanelSportCompetitionsLazyQuery>;
export type GetPanelSportCompetitionsSuspenseQueryHookResult = ReturnType<typeof useGetPanelSportCompetitionsSuspenseQuery>;
export type GetPanelSportCompetitionsQueryResult = Apollo.QueryResult<GetPanelSportCompetitionsQuery, GetPanelSportCompetitionsQueryVariables>;
export const GetPanelScenesDocument = gql`
    query GetPanelScenes {
  scenes {
    id
    name
  }
}
    `;

/**
 * __useGetPanelScenesQuery__
 *
 * To run a query within a React component, call `useGetPanelScenesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPanelScenesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPanelScenesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPanelScenesQuery(baseOptions?: Apollo.QueryHookOptions<GetPanelScenesQuery, GetPanelScenesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPanelScenesQuery, GetPanelScenesQueryVariables>(GetPanelScenesDocument, options);
      }
export function useGetPanelScenesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPanelScenesQuery, GetPanelScenesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPanelScenesQuery, GetPanelScenesQueryVariables>(GetPanelScenesDocument, options);
        }
export function useGetPanelScenesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPanelScenesQuery, GetPanelScenesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPanelScenesQuery, GetPanelScenesQueryVariables>(GetPanelScenesDocument, options);
        }
export type GetPanelScenesQueryHookResult = ReturnType<typeof useGetPanelScenesQuery>;
export type GetPanelScenesLazyQueryHookResult = ReturnType<typeof useGetPanelScenesLazyQuery>;
export type GetPanelScenesSuspenseQueryHookResult = ReturnType<typeof useGetPanelScenesSuspenseQuery>;
export type GetPanelScenesQueryResult = Apollo.QueryResult<GetPanelScenesQuery, GetPanelScenesQueryVariables>;
export const GetPanelSceneDocument = gql`
    query GetPanelScene($id: ID!) {
  scene(id: $id) {
    id
    name
  }
}
    `;

/**
 * __useGetPanelSceneQuery__
 *
 * To run a query within a React component, call `useGetPanelSceneQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPanelSceneQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPanelSceneQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPanelSceneQuery(baseOptions: Apollo.QueryHookOptions<GetPanelSceneQuery, GetPanelSceneQueryVariables> & ({ variables: GetPanelSceneQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPanelSceneQuery, GetPanelSceneQueryVariables>(GetPanelSceneDocument, options);
      }
export function useGetPanelSceneLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPanelSceneQuery, GetPanelSceneQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPanelSceneQuery, GetPanelSceneQueryVariables>(GetPanelSceneDocument, options);
        }
export function useGetPanelSceneSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPanelSceneQuery, GetPanelSceneQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPanelSceneQuery, GetPanelSceneQueryVariables>(GetPanelSceneDocument, options);
        }
export type GetPanelSceneQueryHookResult = ReturnType<typeof useGetPanelSceneQuery>;
export type GetPanelSceneLazyQueryHookResult = ReturnType<typeof useGetPanelSceneLazyQuery>;
export type GetPanelSceneSuspenseQueryHookResult = ReturnType<typeof useGetPanelSceneSuspenseQuery>;
export type GetPanelSceneQueryResult = Apollo.QueryResult<GetPanelSceneQuery, GetPanelSceneQueryVariables>;
export const GetPanelTeamsDocument = gql`
    query GetPanelTeams {
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
    }
  }
}
    `;

/**
 * __useGetPanelTeamsQuery__
 *
 * To run a query within a React component, call `useGetPanelTeamsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPanelTeamsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPanelTeamsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPanelTeamsQuery(baseOptions?: Apollo.QueryHookOptions<GetPanelTeamsQuery, GetPanelTeamsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPanelTeamsQuery, GetPanelTeamsQueryVariables>(GetPanelTeamsDocument, options);
      }
export function useGetPanelTeamsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPanelTeamsQuery, GetPanelTeamsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPanelTeamsQuery, GetPanelTeamsQueryVariables>(GetPanelTeamsDocument, options);
        }
export function useGetPanelTeamsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPanelTeamsQuery, GetPanelTeamsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPanelTeamsQuery, GetPanelTeamsQueryVariables>(GetPanelTeamsDocument, options);
        }
export type GetPanelTeamsQueryHookResult = ReturnType<typeof useGetPanelTeamsQuery>;
export type GetPanelTeamsLazyQueryHookResult = ReturnType<typeof useGetPanelTeamsLazyQuery>;
export type GetPanelTeamsSuspenseQueryHookResult = ReturnType<typeof useGetPanelTeamsSuspenseQuery>;
export type GetPanelTeamsQueryResult = Apollo.QueryResult<GetPanelTeamsQuery, GetPanelTeamsQueryVariables>;
export const GetPanelTeamDocument = gql`
    query GetPanelTeam($id: ID!) {
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
 * __useGetPanelTeamQuery__
 *
 * To run a query within a React component, call `useGetPanelTeamQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPanelTeamQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPanelTeamQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPanelTeamQuery(baseOptions: Apollo.QueryHookOptions<GetPanelTeamQuery, GetPanelTeamQueryVariables> & ({ variables: GetPanelTeamQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPanelTeamQuery, GetPanelTeamQueryVariables>(GetPanelTeamDocument, options);
      }
export function useGetPanelTeamLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPanelTeamQuery, GetPanelTeamQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPanelTeamQuery, GetPanelTeamQueryVariables>(GetPanelTeamDocument, options);
        }
export function useGetPanelTeamSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPanelTeamQuery, GetPanelTeamQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPanelTeamQuery, GetPanelTeamQueryVariables>(GetPanelTeamDocument, options);
        }
export type GetPanelTeamQueryHookResult = ReturnType<typeof useGetPanelTeamQuery>;
export type GetPanelTeamLazyQueryHookResult = ReturnType<typeof useGetPanelTeamLazyQuery>;
export type GetPanelTeamSuspenseQueryHookResult = ReturnType<typeof useGetPanelTeamSuspenseQuery>;
export type GetPanelTeamQueryResult = Apollo.QueryResult<GetPanelTeamQuery, GetPanelTeamQueryVariables>;
export const GetPanelMeDocument = gql`
    query GetPanelMe {
  me {
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
 * __useGetPanelMeQuery__
 *
 * To run a query within a React component, call `useGetPanelMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPanelMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPanelMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPanelMeQuery(baseOptions?: Apollo.QueryHookOptions<GetPanelMeQuery, GetPanelMeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPanelMeQuery, GetPanelMeQueryVariables>(GetPanelMeDocument, options);
      }
export function useGetPanelMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPanelMeQuery, GetPanelMeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPanelMeQuery, GetPanelMeQueryVariables>(GetPanelMeDocument, options);
        }
export function useGetPanelMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPanelMeQuery, GetPanelMeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPanelMeQuery, GetPanelMeQueryVariables>(GetPanelMeDocument, options);
        }
export type GetPanelMeQueryHookResult = ReturnType<typeof useGetPanelMeQuery>;
export type GetPanelMeLazyQueryHookResult = ReturnType<typeof useGetPanelMeLazyQuery>;
export type GetPanelMeSuspenseQueryHookResult = ReturnType<typeof useGetPanelMeSuspenseQuery>;
export type GetPanelMeQueryResult = Apollo.QueryResult<GetPanelMeQuery, GetPanelMeQueryVariables>;
export const GetPanelUsersDocument = gql`
    query GetPanelUsers {
  users {
    id
    name
    email
    teams {
      id
      name
    }
  }
}
    `;

/**
 * __useGetPanelUsersQuery__
 *
 * To run a query within a React component, call `useGetPanelUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPanelUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPanelUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPanelUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetPanelUsersQuery, GetPanelUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPanelUsersQuery, GetPanelUsersQueryVariables>(GetPanelUsersDocument, options);
      }
export function useGetPanelUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPanelUsersQuery, GetPanelUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPanelUsersQuery, GetPanelUsersQueryVariables>(GetPanelUsersDocument, options);
        }
export function useGetPanelUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPanelUsersQuery, GetPanelUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPanelUsersQuery, GetPanelUsersQueryVariables>(GetPanelUsersDocument, options);
        }
export type GetPanelUsersQueryHookResult = ReturnType<typeof useGetPanelUsersQuery>;
export type GetPanelUsersLazyQueryHookResult = ReturnType<typeof useGetPanelUsersLazyQuery>;
export type GetPanelUsersSuspenseQueryHookResult = ReturnType<typeof useGetPanelUsersSuspenseQuery>;
export type GetPanelUsersQueryResult = Apollo.QueryResult<GetPanelUsersQuery, GetPanelUsersQueryVariables>;
export const GetPanelUserDocument = gql`
    query GetPanelUser($id: ID!) {
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
 * __useGetPanelUserQuery__
 *
 * To run a query within a React component, call `useGetPanelUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPanelUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPanelUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPanelUserQuery(baseOptions: Apollo.QueryHookOptions<GetPanelUserQuery, GetPanelUserQueryVariables> & ({ variables: GetPanelUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPanelUserQuery, GetPanelUserQueryVariables>(GetPanelUserDocument, options);
      }
export function useGetPanelUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPanelUserQuery, GetPanelUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPanelUserQuery, GetPanelUserQueryVariables>(GetPanelUserDocument, options);
        }
export function useGetPanelUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPanelUserQuery, GetPanelUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPanelUserQuery, GetPanelUserQueryVariables>(GetPanelUserDocument, options);
        }
export type GetPanelUserQueryHookResult = ReturnType<typeof useGetPanelUserQuery>;
export type GetPanelUserLazyQueryHookResult = ReturnType<typeof useGetPanelUserLazyQuery>;
export type GetPanelUserSuspenseQueryHookResult = ReturnType<typeof useGetPanelUserSuspenseQuery>;
export type GetPanelUserQueryResult = Apollo.QueryResult<GetPanelUserQuery, GetPanelUserQueryVariables>;