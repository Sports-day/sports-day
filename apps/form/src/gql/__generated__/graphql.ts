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
  status?: InputMaybe<Scalars['String']['input']>;
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
  gender?: InputMaybe<Scalars['String']['input']>;
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
  status: Scalars['String']['output'];
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
  /** 審判を作成する */
  createJudgment: Judgment;
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
  deleteUser: User;
  /** ブラケット自動生成（MAIN + オプショナルSUB） */
  generateBracket: Array<Tournament>;
  /** リーグの総当たり戦を自動生成する */
  generateRoundRobin: Array<Match>;
  removeGroupUsers: Group;
  /** トーナメント全体リセット（全ブラケット + 全試合を削除。competition_entries は維持） */
  resetTournamentBrackets: Competition;
  restoreScene: Scene;
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
  updateUser: User;
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


export type MutationCreateJudgmentArgs = {
  input: CreateJudgmentInput;
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


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
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


export type MutationRestoreSceneArgs = {
  id: Scalars['ID']['input'];
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


export type MutationUpdateUserArgs = {
  id: Scalars['ID']['input'];
  input: UpdateUserInput;
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
  isDeleted: Scalars['Boolean']['output'];
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
  status?: InputMaybe<Scalars['String']['input']>;
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

export type UpdateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  gender?: Maybe<Scalars['String']['output']>;
  groups: Array<Group>;
  id: Scalars['ID']['output'];
  judgments: Array<Judgment>;
  name: Scalars['String']['output'];
  teams: Array<Team>;
};

export type GetSceneIdQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSceneIdQuery = { __typename?: 'Query', scenes: Array<{ __typename?: 'Scene', id: string, name: string, isDeleted: boolean }> };

export type GetSceneUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSceneUsersQuery = { __typename?: 'Query', scenes: Array<{ __typename?: 'Scene', isDeleted: boolean, sportScenes: Array<{ __typename?: 'SportScene', scene: { __typename?: 'Scene', id: string }, entries: Array<{ __typename?: 'SportEntry', team: { __typename?: 'Team', users: Array<{ __typename?: 'User', id: string, name: string }> } }> }> }> };

export type GetAllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, name: string }> };

export type GetTypeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTypeQuery = { __typename?: 'Query', scenes: Array<{ __typename?: 'Scene', id: string, isDeleted: boolean }> };

export type GetWeatherQueryVariables = Exact<{ [key: string]: never; }>;


export type GetWeatherQuery = { __typename?: 'Query', scenes: Array<{ __typename?: 'Scene', id: string, name: string, isDeleted: boolean }> };

export type GetSportQueryVariables = Exact<{
  sceneId: Scalars['ID']['input'];
}>;


export type GetSportQuery = { __typename?: 'Query', scene: { __typename?: 'Scene', name: string, sportScenes: Array<{ __typename?: 'SportScene', sport: { __typename?: 'Sport', id: string, name: string } }> } };

export type GetSportDetailQueryVariables = Exact<{
  sportId: Scalars['ID']['input'];
  sceneId: Scalars['ID']['input'];
}>;


export type GetSportDetailQuery = { __typename?: 'Query', sport: { __typename?: 'Sport', name: string }, scene: { __typename?: 'Scene', name: string } };

export type SportDataGetQueryVariables = Exact<{
  sport_Id: Scalars['ID']['input'];
  scene_Id: Scalars['ID']['input'];
}>;


export type SportDataGetQuery = { __typename?: 'Query', sport: { __typename?: 'Sport', name: string }, scene: { __typename?: 'Scene', name: string } };

export type GetTeamDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTeamDataQuery = { __typename?: 'Query', scenes: Array<{ __typename?: 'Scene', isDeleted: boolean, sportScenes: Array<{ __typename?: 'SportScene', sport: { __typename?: 'Sport', id: string }, scene: { __typename?: 'Scene', id: string }, entries: Array<{ __typename?: 'SportEntry', team: { __typename?: 'Team', users: Array<{ __typename?: 'User', name: string }> } }> }> }> };

export type GetSceneSportQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSceneSportQuery = { __typename?: 'Query', scenes: Array<{ __typename?: 'Scene', isDeleted: boolean, sportScenes: Array<{ __typename?: 'SportScene', id: string, entries: Array<{ __typename?: 'SportEntry', team: { __typename?: 'Team', id: string, name: string, users: Array<{ __typename?: 'User', name: string }> } }>, sport: { __typename?: 'Sport', id: string }, scene: { __typename?: 'Scene', id: string } }> }> };

export type GetAllTeamdataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllTeamdataQuery = { __typename?: 'Query', scenes: Array<{ __typename?: 'Scene', isDeleted: boolean, sportScenes: Array<{ __typename?: 'SportScene', scene: { __typename?: 'Scene', id: string, name: string }, sport: { __typename?: 'Sport', id: string, name: string }, entries: Array<{ __typename?: 'SportEntry', team: { __typename?: 'Team', id: string, name: string, users: Array<{ __typename?: 'User', name: string }> } }> }> }> };

export type DeleteTeamFromPopupMutationVariables = Exact<{
  deleteTeamId: Scalars['ID']['input'];
}>;


export type DeleteTeamFromPopupMutation = { __typename?: 'Mutation', deleteTeam: { __typename?: 'Team', id: string } };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, groups: Array<{ __typename?: 'Group', id: string }> } };

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, name: string }> };

export type GetSportsceneQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSportsceneQuery = { __typename?: 'Query', scenes: Array<{ __typename?: 'Scene', isDeleted: boolean, sportScenes: Array<{ __typename?: 'SportScene', id: string, sport: { __typename?: 'Sport', id: string }, scene: { __typename?: 'Scene', id: string }, entries: Array<{ __typename?: 'SportEntry', team: { __typename?: 'Team', id: string, users: Array<{ __typename?: 'User', id: string }> } }> }> }> };

export type GetSportsceneEntriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSportsceneEntriesQuery = { __typename?: 'Query', scenes: Array<{ __typename?: 'Scene', isDeleted: boolean, sportScenes: Array<{ __typename?: 'SportScene', id: string, entries: Array<{ __typename?: 'SportEntry', team: { __typename?: 'Team', id: string, users: Array<{ __typename?: 'User', id: string }> } }> }> }> };

export type GetTeamQueryVariables = Exact<{
  teamId: Scalars['ID']['input'];
}>;


export type GetTeamQuery = { __typename?: 'Query', team: { __typename?: 'Team', users: Array<{ __typename?: 'User', id: string, name: string }> } };

export type CreateTeamMutationVariables = Exact<{
  input: CreateTeamInput;
}>;


export type CreateTeamMutation = { __typename?: 'Mutation', createTeam: { __typename?: 'Team', id: string } };

export type AddTeamMemberMutationVariables = Exact<{
  userIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  teamId: Scalars['ID']['input'];
}>;


export type AddTeamMemberMutation = { __typename?: 'Mutation', updateTeamUsers: { __typename?: 'Team', id: string } };

export type CreateSportEntryMutationVariables = Exact<{
  sportSceneId: Scalars['ID']['input'];
  teamId: Scalars['ID']['input'];
}>;


export type CreateSportEntryMutation = { __typename?: 'Mutation', addSportEntries: { __typename?: 'SportScene', id: string } };

export type DeleteMemberMutationVariables = Exact<{
  teamId: Scalars['ID']['input'];
  userIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type DeleteMemberMutation = { __typename?: 'Mutation', updateTeamUsers: { __typename?: 'Team', id: string } };

export type DeleteTeamMutationVariables = Exact<{
  deleteTeamId: Scalars['ID']['input'];
}>;


export type DeleteTeamMutation = { __typename?: 'Mutation', deleteTeam: { __typename?: 'Team', id: string } };


export const GetSceneIdDocument = gql`
    query GetSceneId {
  scenes {
    id
    name
    isDeleted
  }
}
    `;

/**
 * __useGetSceneIdQuery__
 *
 * To run a query within a React component, call `useGetSceneIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSceneIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSceneIdQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSceneIdQuery(baseOptions?: Apollo.QueryHookOptions<GetSceneIdQuery, GetSceneIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSceneIdQuery, GetSceneIdQueryVariables>(GetSceneIdDocument, options);
      }
export function useGetSceneIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSceneIdQuery, GetSceneIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSceneIdQuery, GetSceneIdQueryVariables>(GetSceneIdDocument, options);
        }
export function useGetSceneIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSceneIdQuery, GetSceneIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSceneIdQuery, GetSceneIdQueryVariables>(GetSceneIdDocument, options);
        }
export type GetSceneIdQueryHookResult = ReturnType<typeof useGetSceneIdQuery>;
export type GetSceneIdLazyQueryHookResult = ReturnType<typeof useGetSceneIdLazyQuery>;
export type GetSceneIdSuspenseQueryHookResult = ReturnType<typeof useGetSceneIdSuspenseQuery>;
export type GetSceneIdQueryResult = Apollo.QueryResult<GetSceneIdQuery, GetSceneIdQueryVariables>;
export const GetSceneUsersDocument = gql`
    query GetSceneUsers {
  scenes {
    isDeleted
    sportScenes {
      scene {
        id
      }
      entries {
        team {
          users {
            id
            name
          }
        }
      }
    }
  }
}
    `;

/**
 * __useGetSceneUsersQuery__
 *
 * To run a query within a React component, call `useGetSceneUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSceneUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSceneUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSceneUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetSceneUsersQuery, GetSceneUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSceneUsersQuery, GetSceneUsersQueryVariables>(GetSceneUsersDocument, options);
      }
export function useGetSceneUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSceneUsersQuery, GetSceneUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSceneUsersQuery, GetSceneUsersQueryVariables>(GetSceneUsersDocument, options);
        }
export function useGetSceneUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSceneUsersQuery, GetSceneUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSceneUsersQuery, GetSceneUsersQueryVariables>(GetSceneUsersDocument, options);
        }
export type GetSceneUsersQueryHookResult = ReturnType<typeof useGetSceneUsersQuery>;
export type GetSceneUsersLazyQueryHookResult = ReturnType<typeof useGetSceneUsersLazyQuery>;
export type GetSceneUsersSuspenseQueryHookResult = ReturnType<typeof useGetSceneUsersSuspenseQuery>;
export type GetSceneUsersQueryResult = Apollo.QueryResult<GetSceneUsersQuery, GetSceneUsersQueryVariables>;
export const GetAllUsersDocument = gql`
    query GetAllUsers {
  users {
    id
    name
  }
}
    `;

/**
 * __useGetAllUsersQuery__
 *
 * To run a query within a React component, call `useGetAllUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
      }
export function useGetAllUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
        }
export function useGetAllUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
        }
export type GetAllUsersQueryHookResult = ReturnType<typeof useGetAllUsersQuery>;
export type GetAllUsersLazyQueryHookResult = ReturnType<typeof useGetAllUsersLazyQuery>;
export type GetAllUsersSuspenseQueryHookResult = ReturnType<typeof useGetAllUsersSuspenseQuery>;
export type GetAllUsersQueryResult = Apollo.QueryResult<GetAllUsersQuery, GetAllUsersQueryVariables>;
export const GetTypeDocument = gql`
    query GetType {
  scenes {
    id
    isDeleted
  }
}
    `;

/**
 * __useGetTypeQuery__
 *
 * To run a query within a React component, call `useGetTypeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTypeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTypeQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTypeQuery(baseOptions?: Apollo.QueryHookOptions<GetTypeQuery, GetTypeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTypeQuery, GetTypeQueryVariables>(GetTypeDocument, options);
      }
export function useGetTypeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTypeQuery, GetTypeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTypeQuery, GetTypeQueryVariables>(GetTypeDocument, options);
        }
export function useGetTypeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTypeQuery, GetTypeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTypeQuery, GetTypeQueryVariables>(GetTypeDocument, options);
        }
export type GetTypeQueryHookResult = ReturnType<typeof useGetTypeQuery>;
export type GetTypeLazyQueryHookResult = ReturnType<typeof useGetTypeLazyQuery>;
export type GetTypeSuspenseQueryHookResult = ReturnType<typeof useGetTypeSuspenseQuery>;
export type GetTypeQueryResult = Apollo.QueryResult<GetTypeQuery, GetTypeQueryVariables>;
export const GetWeatherDocument = gql`
    query GetWeather {
  scenes {
    id
    name
    isDeleted
  }
}
    `;

/**
 * __useGetWeatherQuery__
 *
 * To run a query within a React component, call `useGetWeatherQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWeatherQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWeatherQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetWeatherQuery(baseOptions?: Apollo.QueryHookOptions<GetWeatherQuery, GetWeatherQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetWeatherQuery, GetWeatherQueryVariables>(GetWeatherDocument, options);
      }
export function useGetWeatherLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWeatherQuery, GetWeatherQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetWeatherQuery, GetWeatherQueryVariables>(GetWeatherDocument, options);
        }
export function useGetWeatherSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetWeatherQuery, GetWeatherQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetWeatherQuery, GetWeatherQueryVariables>(GetWeatherDocument, options);
        }
export type GetWeatherQueryHookResult = ReturnType<typeof useGetWeatherQuery>;
export type GetWeatherLazyQueryHookResult = ReturnType<typeof useGetWeatherLazyQuery>;
export type GetWeatherSuspenseQueryHookResult = ReturnType<typeof useGetWeatherSuspenseQuery>;
export type GetWeatherQueryResult = Apollo.QueryResult<GetWeatherQuery, GetWeatherQueryVariables>;
export const GetSportDocument = gql`
    query GetSport($sceneId: ID!) {
  scene(id: $sceneId) {
    name
    sportScenes {
      sport {
        id
        name
      }
    }
  }
}
    `;

/**
 * __useGetSportQuery__
 *
 * To run a query within a React component, call `useGetSportQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSportQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSportQuery({
 *   variables: {
 *      sceneId: // value for 'sceneId'
 *   },
 * });
 */
export function useGetSportQuery(baseOptions: Apollo.QueryHookOptions<GetSportQuery, GetSportQueryVariables> & ({ variables: GetSportQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSportQuery, GetSportQueryVariables>(GetSportDocument, options);
      }
export function useGetSportLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSportQuery, GetSportQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSportQuery, GetSportQueryVariables>(GetSportDocument, options);
        }
export function useGetSportSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSportQuery, GetSportQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSportQuery, GetSportQueryVariables>(GetSportDocument, options);
        }
export type GetSportQueryHookResult = ReturnType<typeof useGetSportQuery>;
export type GetSportLazyQueryHookResult = ReturnType<typeof useGetSportLazyQuery>;
export type GetSportSuspenseQueryHookResult = ReturnType<typeof useGetSportSuspenseQuery>;
export type GetSportQueryResult = Apollo.QueryResult<GetSportQuery, GetSportQueryVariables>;
export const GetSportDetailDocument = gql`
    query GetSportDetail($sportId: ID!, $sceneId: ID!) {
  sport(id: $sportId) {
    name
  }
  scene(id: $sceneId) {
    name
  }
}
    `;

/**
 * __useGetSportDetailQuery__
 *
 * To run a query within a React component, call `useGetSportDetailQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSportDetailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSportDetailQuery({
 *   variables: {
 *      sportId: // value for 'sportId'
 *      sceneId: // value for 'sceneId'
 *   },
 * });
 */
export function useGetSportDetailQuery(baseOptions: Apollo.QueryHookOptions<GetSportDetailQuery, GetSportDetailQueryVariables> & ({ variables: GetSportDetailQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSportDetailQuery, GetSportDetailQueryVariables>(GetSportDetailDocument, options);
      }
export function useGetSportDetailLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSportDetailQuery, GetSportDetailQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSportDetailQuery, GetSportDetailQueryVariables>(GetSportDetailDocument, options);
        }
export function useGetSportDetailSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSportDetailQuery, GetSportDetailQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSportDetailQuery, GetSportDetailQueryVariables>(GetSportDetailDocument, options);
        }
export type GetSportDetailQueryHookResult = ReturnType<typeof useGetSportDetailQuery>;
export type GetSportDetailLazyQueryHookResult = ReturnType<typeof useGetSportDetailLazyQuery>;
export type GetSportDetailSuspenseQueryHookResult = ReturnType<typeof useGetSportDetailSuspenseQuery>;
export type GetSportDetailQueryResult = Apollo.QueryResult<GetSportDetailQuery, GetSportDetailQueryVariables>;
export const SportDataGetDocument = gql`
    query SportDataGet($sport_Id: ID!, $scene_Id: ID!) {
  sport(id: $sport_Id) {
    name
  }
  scene(id: $scene_Id) {
    name
  }
}
    `;

/**
 * __useSportDataGetQuery__
 *
 * To run a query within a React component, call `useSportDataGetQuery` and pass it any options that fit your needs.
 * When your component renders, `useSportDataGetQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSportDataGetQuery({
 *   variables: {
 *      sport_Id: // value for 'sport_Id'
 *      scene_Id: // value for 'scene_Id'
 *   },
 * });
 */
export function useSportDataGetQuery(baseOptions: Apollo.QueryHookOptions<SportDataGetQuery, SportDataGetQueryVariables> & ({ variables: SportDataGetQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SportDataGetQuery, SportDataGetQueryVariables>(SportDataGetDocument, options);
      }
export function useSportDataGetLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SportDataGetQuery, SportDataGetQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SportDataGetQuery, SportDataGetQueryVariables>(SportDataGetDocument, options);
        }
export function useSportDataGetSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SportDataGetQuery, SportDataGetQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SportDataGetQuery, SportDataGetQueryVariables>(SportDataGetDocument, options);
        }
export type SportDataGetQueryHookResult = ReturnType<typeof useSportDataGetQuery>;
export type SportDataGetLazyQueryHookResult = ReturnType<typeof useSportDataGetLazyQuery>;
export type SportDataGetSuspenseQueryHookResult = ReturnType<typeof useSportDataGetSuspenseQuery>;
export type SportDataGetQueryResult = Apollo.QueryResult<SportDataGetQuery, SportDataGetQueryVariables>;
export const GetTeamDataDocument = gql`
    query GetTeamData {
  scenes {
    isDeleted
    sportScenes {
      sport {
        id
      }
      scene {
        id
      }
      entries {
        team {
          users {
            name
          }
        }
      }
    }
  }
}
    `;

/**
 * __useGetTeamDataQuery__
 *
 * To run a query within a React component, call `useGetTeamDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTeamDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTeamDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTeamDataQuery(baseOptions?: Apollo.QueryHookOptions<GetTeamDataQuery, GetTeamDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTeamDataQuery, GetTeamDataQueryVariables>(GetTeamDataDocument, options);
      }
export function useGetTeamDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTeamDataQuery, GetTeamDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTeamDataQuery, GetTeamDataQueryVariables>(GetTeamDataDocument, options);
        }
export function useGetTeamDataSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTeamDataQuery, GetTeamDataQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTeamDataQuery, GetTeamDataQueryVariables>(GetTeamDataDocument, options);
        }
export type GetTeamDataQueryHookResult = ReturnType<typeof useGetTeamDataQuery>;
export type GetTeamDataLazyQueryHookResult = ReturnType<typeof useGetTeamDataLazyQuery>;
export type GetTeamDataSuspenseQueryHookResult = ReturnType<typeof useGetTeamDataSuspenseQuery>;
export type GetTeamDataQueryResult = Apollo.QueryResult<GetTeamDataQuery, GetTeamDataQueryVariables>;
export const GetSceneSportDocument = gql`
    query GetSceneSport {
  scenes {
    isDeleted
    sportScenes {
      id
      entries {
        team {
          id
          name
          users {
            name
          }
        }
      }
      sport {
        id
      }
      scene {
        id
      }
    }
  }
}
    `;

/**
 * __useGetSceneSportQuery__
 *
 * To run a query within a React component, call `useGetSceneSportQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSceneSportQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSceneSportQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSceneSportQuery(baseOptions?: Apollo.QueryHookOptions<GetSceneSportQuery, GetSceneSportQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSceneSportQuery, GetSceneSportQueryVariables>(GetSceneSportDocument, options);
      }
export function useGetSceneSportLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSceneSportQuery, GetSceneSportQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSceneSportQuery, GetSceneSportQueryVariables>(GetSceneSportDocument, options);
        }
export function useGetSceneSportSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSceneSportQuery, GetSceneSportQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSceneSportQuery, GetSceneSportQueryVariables>(GetSceneSportDocument, options);
        }
export type GetSceneSportQueryHookResult = ReturnType<typeof useGetSceneSportQuery>;
export type GetSceneSportLazyQueryHookResult = ReturnType<typeof useGetSceneSportLazyQuery>;
export type GetSceneSportSuspenseQueryHookResult = ReturnType<typeof useGetSceneSportSuspenseQuery>;
export type GetSceneSportQueryResult = Apollo.QueryResult<GetSceneSportQuery, GetSceneSportQueryVariables>;
export const GetAllTeamdataDocument = gql`
    query GetAllTeamdata {
  scenes {
    isDeleted
    sportScenes {
      scene {
        id
        name
      }
      sport {
        id
        name
      }
      entries {
        team {
          id
          name
          users {
            name
          }
        }
      }
    }
  }
}
    `;

/**
 * __useGetAllTeamdataQuery__
 *
 * To run a query within a React component, call `useGetAllTeamdataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllTeamdataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllTeamdataQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllTeamdataQuery(baseOptions?: Apollo.QueryHookOptions<GetAllTeamdataQuery, GetAllTeamdataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllTeamdataQuery, GetAllTeamdataQueryVariables>(GetAllTeamdataDocument, options);
      }
export function useGetAllTeamdataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllTeamdataQuery, GetAllTeamdataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllTeamdataQuery, GetAllTeamdataQueryVariables>(GetAllTeamdataDocument, options);
        }
export function useGetAllTeamdataSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllTeamdataQuery, GetAllTeamdataQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllTeamdataQuery, GetAllTeamdataQueryVariables>(GetAllTeamdataDocument, options);
        }
export type GetAllTeamdataQueryHookResult = ReturnType<typeof useGetAllTeamdataQuery>;
export type GetAllTeamdataLazyQueryHookResult = ReturnType<typeof useGetAllTeamdataLazyQuery>;
export type GetAllTeamdataSuspenseQueryHookResult = ReturnType<typeof useGetAllTeamdataSuspenseQuery>;
export type GetAllTeamdataQueryResult = Apollo.QueryResult<GetAllTeamdataQuery, GetAllTeamdataQueryVariables>;
export const DeleteTeamFromPopupDocument = gql`
    mutation DeleteTeamFromPopup($deleteTeamId: ID!) {
  deleteTeam(id: $deleteTeamId) {
    id
  }
}
    `;
export type DeleteTeamFromPopupMutationFn = Apollo.MutationFunction<DeleteTeamFromPopupMutation, DeleteTeamFromPopupMutationVariables>;

/**
 * __useDeleteTeamFromPopupMutation__
 *
 * To run a mutation, you first call `useDeleteTeamFromPopupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTeamFromPopupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTeamFromPopupMutation, { data, loading, error }] = useDeleteTeamFromPopupMutation({
 *   variables: {
 *      deleteTeamId: // value for 'deleteTeamId'
 *   },
 * });
 */
export function useDeleteTeamFromPopupMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTeamFromPopupMutation, DeleteTeamFromPopupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTeamFromPopupMutation, DeleteTeamFromPopupMutationVariables>(DeleteTeamFromPopupDocument, options);
      }
export type DeleteTeamFromPopupMutationHookResult = ReturnType<typeof useDeleteTeamFromPopupMutation>;
export type DeleteTeamFromPopupMutationResult = Apollo.MutationResult<DeleteTeamFromPopupMutation>;
export type DeleteTeamFromPopupMutationOptions = Apollo.BaseMutationOptions<DeleteTeamFromPopupMutation, DeleteTeamFromPopupMutationVariables>;
export const GetMeDocument = gql`
    query GetMe {
  me {
    id
    groups {
      id
    }
  }
}
    `;

/**
 * __useGetMeQuery__
 *
 * To run a query within a React component, call `useGetMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMeQuery(baseOptions?: Apollo.QueryHookOptions<GetMeQuery, GetMeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMeQuery, GetMeQueryVariables>(GetMeDocument, options);
      }
export function useGetMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMeQuery, GetMeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMeQuery, GetMeQueryVariables>(GetMeDocument, options);
        }
export function useGetMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMeQuery, GetMeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMeQuery, GetMeQueryVariables>(GetMeDocument, options);
        }
export type GetMeQueryHookResult = ReturnType<typeof useGetMeQuery>;
export type GetMeLazyQueryHookResult = ReturnType<typeof useGetMeLazyQuery>;
export type GetMeSuspenseQueryHookResult = ReturnType<typeof useGetMeSuspenseQuery>;
export type GetMeQueryResult = Apollo.QueryResult<GetMeQuery, GetMeQueryVariables>;
export const GetUsersDocument = gql`
    query GetUsers {
  users {
    id
    name
  }
}
    `;

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
      }
export function useGetUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export function useGetUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>;
export type GetUsersLazyQueryHookResult = ReturnType<typeof useGetUsersLazyQuery>;
export type GetUsersSuspenseQueryHookResult = ReturnType<typeof useGetUsersSuspenseQuery>;
export type GetUsersQueryResult = Apollo.QueryResult<GetUsersQuery, GetUsersQueryVariables>;
export const GetSportsceneDocument = gql`
    query GetSportscene {
  scenes {
    isDeleted
    sportScenes {
      id
      sport {
        id
      }
      scene {
        id
      }
      entries {
        team {
          id
          users {
            id
          }
        }
      }
    }
  }
}
    `;

/**
 * __useGetSportsceneQuery__
 *
 * To run a query within a React component, call `useGetSportsceneQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSportsceneQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSportsceneQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSportsceneQuery(baseOptions?: Apollo.QueryHookOptions<GetSportsceneQuery, GetSportsceneQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSportsceneQuery, GetSportsceneQueryVariables>(GetSportsceneDocument, options);
      }
export function useGetSportsceneLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSportsceneQuery, GetSportsceneQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSportsceneQuery, GetSportsceneQueryVariables>(GetSportsceneDocument, options);
        }
export function useGetSportsceneSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSportsceneQuery, GetSportsceneQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSportsceneQuery, GetSportsceneQueryVariables>(GetSportsceneDocument, options);
        }
export type GetSportsceneQueryHookResult = ReturnType<typeof useGetSportsceneQuery>;
export type GetSportsceneLazyQueryHookResult = ReturnType<typeof useGetSportsceneLazyQuery>;
export type GetSportsceneSuspenseQueryHookResult = ReturnType<typeof useGetSportsceneSuspenseQuery>;
export type GetSportsceneQueryResult = Apollo.QueryResult<GetSportsceneQuery, GetSportsceneQueryVariables>;
export const GetSportsceneEntriesDocument = gql`
    query GetSportsceneEntries {
  scenes {
    isDeleted
    sportScenes {
      id
      entries {
        team {
          id
          users {
            id
          }
        }
      }
    }
  }
}
    `;

/**
 * __useGetSportsceneEntriesQuery__
 *
 * To run a query within a React component, call `useGetSportsceneEntriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSportsceneEntriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSportsceneEntriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSportsceneEntriesQuery(baseOptions?: Apollo.QueryHookOptions<GetSportsceneEntriesQuery, GetSportsceneEntriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSportsceneEntriesQuery, GetSportsceneEntriesQueryVariables>(GetSportsceneEntriesDocument, options);
      }
export function useGetSportsceneEntriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSportsceneEntriesQuery, GetSportsceneEntriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSportsceneEntriesQuery, GetSportsceneEntriesQueryVariables>(GetSportsceneEntriesDocument, options);
        }
export function useGetSportsceneEntriesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSportsceneEntriesQuery, GetSportsceneEntriesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSportsceneEntriesQuery, GetSportsceneEntriesQueryVariables>(GetSportsceneEntriesDocument, options);
        }
export type GetSportsceneEntriesQueryHookResult = ReturnType<typeof useGetSportsceneEntriesQuery>;
export type GetSportsceneEntriesLazyQueryHookResult = ReturnType<typeof useGetSportsceneEntriesLazyQuery>;
export type GetSportsceneEntriesSuspenseQueryHookResult = ReturnType<typeof useGetSportsceneEntriesSuspenseQuery>;
export type GetSportsceneEntriesQueryResult = Apollo.QueryResult<GetSportsceneEntriesQuery, GetSportsceneEntriesQueryVariables>;
export const GetTeamDocument = gql`
    query GetTeam($teamId: ID!) {
  team(id: $teamId) {
    users {
      id
      name
    }
  }
}
    `;

/**
 * __useGetTeamQuery__
 *
 * To run a query within a React component, call `useGetTeamQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTeamQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTeamQuery({
 *   variables: {
 *      teamId: // value for 'teamId'
 *   },
 * });
 */
export function useGetTeamQuery(baseOptions: Apollo.QueryHookOptions<GetTeamQuery, GetTeamQueryVariables> & ({ variables: GetTeamQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTeamQuery, GetTeamQueryVariables>(GetTeamDocument, options);
      }
export function useGetTeamLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTeamQuery, GetTeamQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTeamQuery, GetTeamQueryVariables>(GetTeamDocument, options);
        }
export function useGetTeamSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTeamQuery, GetTeamQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTeamQuery, GetTeamQueryVariables>(GetTeamDocument, options);
        }
export type GetTeamQueryHookResult = ReturnType<typeof useGetTeamQuery>;
export type GetTeamLazyQueryHookResult = ReturnType<typeof useGetTeamLazyQuery>;
export type GetTeamSuspenseQueryHookResult = ReturnType<typeof useGetTeamSuspenseQuery>;
export type GetTeamQueryResult = Apollo.QueryResult<GetTeamQuery, GetTeamQueryVariables>;
export const CreateTeamDocument = gql`
    mutation CreateTeam($input: CreateTeamInput!) {
  createTeam(input: $input) {
    id
  }
}
    `;
export type CreateTeamMutationFn = Apollo.MutationFunction<CreateTeamMutation, CreateTeamMutationVariables>;

/**
 * __useCreateTeamMutation__
 *
 * To run a mutation, you first call `useCreateTeamMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTeamMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTeamMutation, { data, loading, error }] = useCreateTeamMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTeamMutation(baseOptions?: Apollo.MutationHookOptions<CreateTeamMutation, CreateTeamMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTeamMutation, CreateTeamMutationVariables>(CreateTeamDocument, options);
      }
export type CreateTeamMutationHookResult = ReturnType<typeof useCreateTeamMutation>;
export type CreateTeamMutationResult = Apollo.MutationResult<CreateTeamMutation>;
export type CreateTeamMutationOptions = Apollo.BaseMutationOptions<CreateTeamMutation, CreateTeamMutationVariables>;
export const AddTeamMemberDocument = gql`
    mutation AddTeamMember($userIds: [ID!]!, $teamId: ID!) {
  updateTeamUsers(id: $teamId, input: {addUserIds: $userIds}) {
    id
  }
}
    `;
export type AddTeamMemberMutationFn = Apollo.MutationFunction<AddTeamMemberMutation, AddTeamMemberMutationVariables>;

/**
 * __useAddTeamMemberMutation__
 *
 * To run a mutation, you first call `useAddTeamMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddTeamMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addTeamMemberMutation, { data, loading, error }] = useAddTeamMemberMutation({
 *   variables: {
 *      userIds: // value for 'userIds'
 *      teamId: // value for 'teamId'
 *   },
 * });
 */
export function useAddTeamMemberMutation(baseOptions?: Apollo.MutationHookOptions<AddTeamMemberMutation, AddTeamMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddTeamMemberMutation, AddTeamMemberMutationVariables>(AddTeamMemberDocument, options);
      }
export type AddTeamMemberMutationHookResult = ReturnType<typeof useAddTeamMemberMutation>;
export type AddTeamMemberMutationResult = Apollo.MutationResult<AddTeamMemberMutation>;
export type AddTeamMemberMutationOptions = Apollo.BaseMutationOptions<AddTeamMemberMutation, AddTeamMemberMutationVariables>;
export const CreateSportEntryDocument = gql`
    mutation CreateSportEntry($sportSceneId: ID!, $teamId: ID!) {
  addSportEntries(id: $sportSceneId, input: {teamIds: [$teamId]}) {
    id
  }
}
    `;
export type CreateSportEntryMutationFn = Apollo.MutationFunction<CreateSportEntryMutation, CreateSportEntryMutationVariables>;

/**
 * __useCreateSportEntryMutation__
 *
 * To run a mutation, you first call `useCreateSportEntryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSportEntryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSportEntryMutation, { data, loading, error }] = useCreateSportEntryMutation({
 *   variables: {
 *      sportSceneId: // value for 'sportSceneId'
 *      teamId: // value for 'teamId'
 *   },
 * });
 */
export function useCreateSportEntryMutation(baseOptions?: Apollo.MutationHookOptions<CreateSportEntryMutation, CreateSportEntryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSportEntryMutation, CreateSportEntryMutationVariables>(CreateSportEntryDocument, options);
      }
export type CreateSportEntryMutationHookResult = ReturnType<typeof useCreateSportEntryMutation>;
export type CreateSportEntryMutationResult = Apollo.MutationResult<CreateSportEntryMutation>;
export type CreateSportEntryMutationOptions = Apollo.BaseMutationOptions<CreateSportEntryMutation, CreateSportEntryMutationVariables>;
export const DeleteMemberDocument = gql`
    mutation DeleteMember($teamId: ID!, $userIds: [ID!]!) {
  updateTeamUsers(id: $teamId, input: {removeUserIds: $userIds}) {
    id
  }
}
    `;
export type DeleteMemberMutationFn = Apollo.MutationFunction<DeleteMemberMutation, DeleteMemberMutationVariables>;

/**
 * __useDeleteMemberMutation__
 *
 * To run a mutation, you first call `useDeleteMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMemberMutation, { data, loading, error }] = useDeleteMemberMutation({
 *   variables: {
 *      teamId: // value for 'teamId'
 *      userIds: // value for 'userIds'
 *   },
 * });
 */
export function useDeleteMemberMutation(baseOptions?: Apollo.MutationHookOptions<DeleteMemberMutation, DeleteMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteMemberMutation, DeleteMemberMutationVariables>(DeleteMemberDocument, options);
      }
export type DeleteMemberMutationHookResult = ReturnType<typeof useDeleteMemberMutation>;
export type DeleteMemberMutationResult = Apollo.MutationResult<DeleteMemberMutation>;
export type DeleteMemberMutationOptions = Apollo.BaseMutationOptions<DeleteMemberMutation, DeleteMemberMutationVariables>;
export const DeleteTeamDocument = gql`
    mutation DeleteTeam($deleteTeamId: ID!) {
  deleteTeam(id: $deleteTeamId) {
    id
  }
}
    `;
export type DeleteTeamMutationFn = Apollo.MutationFunction<DeleteTeamMutation, DeleteTeamMutationVariables>;

/**
 * __useDeleteTeamMutation__
 *
 * To run a mutation, you first call `useDeleteTeamMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTeamMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTeamMutation, { data, loading, error }] = useDeleteTeamMutation({
 *   variables: {
 *      deleteTeamId: // value for 'deleteTeamId'
 *   },
 * });
 */
export function useDeleteTeamMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTeamMutation, DeleteTeamMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTeamMutation, DeleteTeamMutationVariables>(DeleteTeamDocument, options);
      }
export type DeleteTeamMutationHookResult = ReturnType<typeof useDeleteTeamMutation>;
export type DeleteTeamMutationResult = Apollo.MutationResult<DeleteTeamMutation>;
export type DeleteTeamMutationOptions = Apollo.BaseMutationOptions<DeleteTeamMutation, DeleteTeamMutationVariables>;