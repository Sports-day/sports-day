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

export const BracketState = {
  Building: 'BUILDING',
  Completed: 'COMPLETED',
  InProgress: 'IN_PROGRESS',
  Ready: 'READY'
} as const;

export type BracketState = typeof BracketState[keyof typeof BracketState];
export const BracketType = {
  Main: 'MAIN',
  Sub: 'SUB'
} as const;

export type BracketType = typeof BracketType[keyof typeof BracketType];
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

export const CompetitionType = {
  League: 'LEAGUE',
  Tournament: 'TOURNAMENT'
} as const;

export type CompetitionType = typeof CompetitionType[keyof typeof CompetitionType];
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

export const MatchStatus = {
  Canceled: 'CANCELED',
  Finished: 'FINISHED',
  Ongoing: 'ONGOING',
  Standby: 'STANDBY'
} as const;

export type MatchStatus = typeof MatchStatus[keyof typeof MatchStatus];
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

export const PlacementMethod = {
  Balanced: 'BALANCED',
  Manual: 'MANUAL',
  Random: 'RANDOM',
  SeedOptimized: 'SEED_OPTIMIZED'
} as const;

export type PlacementMethod = typeof PlacementMethod[keyof typeof PlacementMethod];
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

export const RankingConditionKey = {
  AdminDecision: 'ADMIN_DECISION',
  GoalDiff: 'GOAL_DIFF',
  HeadToHead: 'HEAD_TO_HEAD',
  TotalGoals: 'TOTAL_GOALS',
  WinPoints: 'WIN_POINTS'
} as const;

export type RankingConditionKey = typeof RankingConditionKey[keyof typeof RankingConditionKey];
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

export const SlotSourceType = {
  MatchLoser: 'MATCH_LOSER',
  MatchWinner: 'MATCH_WINNER',
  Seed: 'SEED'
} as const;

export type SlotSourceType = typeof SlotSourceType[keyof typeof SlotSourceType];
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


export type GetAdminCompetitionQuery = { __typename?: 'Query', competition: { __typename?: 'Competition', id: string, name: string, type: CompetitionType, scene: { __typename?: 'Scene', id: string, name: string }, teams: Array<{ __typename?: 'Team', id: string, name: string, group: { __typename?: 'Group', id: string, name: string } }>, league?: { __typename?: 'League', id: string, name: string } | null } };

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


export type GetAdminTournamentQuery = { __typename?: 'Query', tournament: { __typename?: 'Tournament', id: string, name: string, bracketType: BracketType, placementMethod?: PlacementMethod | null, displayOrder: number, state: BracketState, progress: number, competition: { __typename?: 'Competition', id: string, name: string }, matches: Array<{ __typename?: 'Match', id: string, time: string, status: MatchStatus, winnerTeam?: { __typename?: 'Team', id: string } | null, entries: Array<{ __typename?: 'MatchEntry', id: string, score: number, team?: { __typename?: 'Team', id: string, name: string } | null }> }>, slots: Array<{ __typename?: 'TournamentSlot', id: string, sourceType: SlotSourceType, seedNumber?: number | null, sourceMatch?: { __typename?: 'Match', id: string } | null, matchEntry: { __typename?: 'MatchEntry', id: string, score: number, team?: { __typename?: 'Team', id: string, name: string } | null } }> } };

export type UpdateAdminTournamentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateTournamentInput;
}>;


export type UpdateAdminTournamentMutation = { __typename?: 'Mutation', updateTournament: { __typename?: 'Tournament', id: string, name: string, displayOrder: number } };

export type DeleteAdminTournamentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteAdminTournamentMutation = { __typename?: 'Mutation', deleteTournament: { __typename?: 'Tournament', id: string } };

export type GetAdminPromotionRulesQueryVariables = Exact<{
  sourceCompetitionId: Scalars['ID']['input'];
}>;


export type GetAdminPromotionRulesQuery = { __typename?: 'Query', promotionRules: Array<{ __typename?: 'PromotionRule', id: string, rankSpec: string, slot?: number | null, sourceCompetition: { __typename?: 'Competition', id: string }, targetCompetition: { __typename?: 'Competition', id: string, name: string, type: CompetitionType } }> };

export type CreateAdminPromotionRuleMutationVariables = Exact<{
  input: CreatePromotionRuleInput;
}>;


export type CreateAdminPromotionRuleMutation = { __typename?: 'Mutation', createPromotionRule: { __typename?: 'PromotionRule', id: string, rankSpec: string, targetCompetition: { __typename?: 'Competition', id: string, name: string, type: CompetitionType } } };

export type DeleteAdminPromotionRuleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteAdminPromotionRuleMutation = { __typename?: 'Mutation', deletePromotionRule: { __typename?: 'PromotionRule', id: string } };

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

export type GetAdminImagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdminImagesQuery = { __typename?: 'Query', images: Array<{ __typename?: 'Image', id: string, url?: string | null, status: string }> };

export type GetAdminImageQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetAdminImageQuery = { __typename?: 'Query', image: { __typename?: 'Image', id: string, url?: string | null, status: string } };

export type CreateAdminImageUploadUrlMutationVariables = Exact<{
  input: CreateImageUploadUrlInput;
}>;


export type CreateAdminImageUploadUrlMutation = { __typename?: 'Mutation', createImageUploadURL: { __typename?: 'ImageUploadURL', uploadUrl: string, imageId: string } };

export type DeleteAdminImageMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteAdminImageMutation = { __typename?: 'Mutation', deleteImage: { __typename?: 'Image', id: string } };

export type GetAdminInformationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdminInformationsQuery = { __typename?: 'Query', Informations: Array<{ __typename?: 'Information', id: string, title: string, content: string }> };

export type GetAdminInformationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetAdminInformationQuery = { __typename?: 'Query', Information: { __typename?: 'Information', id: string, title: string, content: string } };

export type CreateAdminInformationMutationVariables = Exact<{
  input: CreateInformationInput;
}>;


export type CreateAdminInformationMutation = { __typename?: 'Mutation', createInformation: { __typename?: 'Information', id: string, title: string, content: string } };

export type UpdateAdminInformationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateInformationInput;
}>;


export type UpdateAdminInformationMutation = { __typename?: 'Mutation', updateInformation: { __typename?: 'Information', id: string, title: string, content: string } };

export type DeleteAdminInformationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteAdminInformationMutation = { __typename?: 'Mutation', deleteInformation: { __typename?: 'Information', id: string } };

export type GetAdminLocationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdminLocationsQuery = { __typename?: 'Query', locations: Array<{ __typename?: 'Location', id: string, name: string }> };

export type GetAdminLocationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetAdminLocationQuery = { __typename?: 'Query', location: { __typename?: 'Location', id: string, name: string } };

export type CreateAdminLocationMutationVariables = Exact<{
  input: CreateLocationInput;
}>;


export type CreateAdminLocationMutation = { __typename?: 'Mutation', createLocation: { __typename?: 'Location', id: string, name: string } };

export type UpdateAdminLocationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateLocationInput;
}>;


export type UpdateAdminLocationMutation = { __typename?: 'Mutation', updateLocation: { __typename?: 'Location', id: string, name: string } };

export type DeleteAdminLocationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteAdminLocationMutation = { __typename?: 'Mutation', deleteLocation: { __typename?: 'Location', id: string } };

export type GetAdminMatchesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdminMatchesQuery = { __typename?: 'Query', matches: Array<{ __typename?: 'Match', id: string, time: string, status: MatchStatus, location?: { __typename?: 'Location', id: string, name: string } | null, competition: { __typename?: 'Competition', id: string, name: string }, winnerTeam?: { __typename?: 'Team', id: string } | null, entries: Array<{ __typename?: 'MatchEntry', id: string, score: number, team?: { __typename?: 'Team', id: string, name: string } | null }> }> };

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

export type GetAdminMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdminMeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, name: string, email: string, groups: Array<{ __typename?: 'Group', id: string, name: string }>, teams: Array<{ __typename?: 'Team', id: string, name: string }> } };

export type GetAdminScenesForTagsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdminScenesForTagsQuery = { __typename?: 'Query', scenes: Array<{ __typename?: 'Scene', id: string, name: string }> };

export type GetAdminSceneForTagQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetAdminSceneForTagQuery = { __typename?: 'Query', scene: { __typename?: 'Scene', id: string, name: string } };

export type CreateAdminSceneForTagMutationVariables = Exact<{
  input: CreateSceneInput;
}>;


export type CreateAdminSceneForTagMutation = { __typename?: 'Mutation', createScene: { __typename?: 'Scene', id: string, name: string } };

export type UpdateAdminSceneForTagMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateSceneInput;
}>;


export type UpdateAdminSceneForTagMutation = { __typename?: 'Mutation', updateScene: { __typename?: 'Scene', id: string, name: string } };

export type DeleteAdminSceneForTagMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteAdminSceneForTagMutation = { __typename?: 'Mutation', deleteScene: { __typename?: 'Scene', id: string } };

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
    league {
      id
      name
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
      winnerTeam {
        id
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
export const UpdateAdminTournamentDocument = gql`
    mutation UpdateAdminTournament($id: ID!, $input: UpdateTournamentInput!) {
  updateTournament(id: $id, input: $input) {
    id
    name
    displayOrder
  }
}
    `;
export type UpdateAdminTournamentMutationFn = Apollo.MutationFunction<UpdateAdminTournamentMutation, UpdateAdminTournamentMutationVariables>;

/**
 * __useUpdateAdminTournamentMutation__
 *
 * To run a mutation, you first call `useUpdateAdminTournamentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAdminTournamentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAdminTournamentMutation, { data, loading, error }] = useUpdateAdminTournamentMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateAdminTournamentMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAdminTournamentMutation, UpdateAdminTournamentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAdminTournamentMutation, UpdateAdminTournamentMutationVariables>(UpdateAdminTournamentDocument, options);
      }
export type UpdateAdminTournamentMutationHookResult = ReturnType<typeof useUpdateAdminTournamentMutation>;
export type UpdateAdminTournamentMutationResult = Apollo.MutationResult<UpdateAdminTournamentMutation>;
export type UpdateAdminTournamentMutationOptions = Apollo.BaseMutationOptions<UpdateAdminTournamentMutation, UpdateAdminTournamentMutationVariables>;
export const DeleteAdminTournamentDocument = gql`
    mutation DeleteAdminTournament($id: ID!) {
  deleteTournament(id: $id) {
    id
  }
}
    `;
export type DeleteAdminTournamentMutationFn = Apollo.MutationFunction<DeleteAdminTournamentMutation, DeleteAdminTournamentMutationVariables>;

/**
 * __useDeleteAdminTournamentMutation__
 *
 * To run a mutation, you first call `useDeleteAdminTournamentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAdminTournamentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAdminTournamentMutation, { data, loading, error }] = useDeleteAdminTournamentMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteAdminTournamentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAdminTournamentMutation, DeleteAdminTournamentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAdminTournamentMutation, DeleteAdminTournamentMutationVariables>(DeleteAdminTournamentDocument, options);
      }
export type DeleteAdminTournamentMutationHookResult = ReturnType<typeof useDeleteAdminTournamentMutation>;
export type DeleteAdminTournamentMutationResult = Apollo.MutationResult<DeleteAdminTournamentMutation>;
export type DeleteAdminTournamentMutationOptions = Apollo.BaseMutationOptions<DeleteAdminTournamentMutation, DeleteAdminTournamentMutationVariables>;
export const GetAdminPromotionRulesDocument = gql`
    query GetAdminPromotionRules($sourceCompetitionId: ID!) {
  promotionRules(sourceCompetitionId: $sourceCompetitionId) {
    id
    sourceCompetition {
      id
    }
    targetCompetition {
      id
      name
      type
    }
    rankSpec
    slot
  }
}
    `;

/**
 * __useGetAdminPromotionRulesQuery__
 *
 * To run a query within a React component, call `useGetAdminPromotionRulesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminPromotionRulesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminPromotionRulesQuery({
 *   variables: {
 *      sourceCompetitionId: // value for 'sourceCompetitionId'
 *   },
 * });
 */
export function useGetAdminPromotionRulesQuery(baseOptions: Apollo.QueryHookOptions<GetAdminPromotionRulesQuery, GetAdminPromotionRulesQueryVariables> & ({ variables: GetAdminPromotionRulesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAdminPromotionRulesQuery, GetAdminPromotionRulesQueryVariables>(GetAdminPromotionRulesDocument, options);
      }
export function useGetAdminPromotionRulesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAdminPromotionRulesQuery, GetAdminPromotionRulesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAdminPromotionRulesQuery, GetAdminPromotionRulesQueryVariables>(GetAdminPromotionRulesDocument, options);
        }
export function useGetAdminPromotionRulesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAdminPromotionRulesQuery, GetAdminPromotionRulesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAdminPromotionRulesQuery, GetAdminPromotionRulesQueryVariables>(GetAdminPromotionRulesDocument, options);
        }
export type GetAdminPromotionRulesQueryHookResult = ReturnType<typeof useGetAdminPromotionRulesQuery>;
export type GetAdminPromotionRulesLazyQueryHookResult = ReturnType<typeof useGetAdminPromotionRulesLazyQuery>;
export type GetAdminPromotionRulesSuspenseQueryHookResult = ReturnType<typeof useGetAdminPromotionRulesSuspenseQuery>;
export type GetAdminPromotionRulesQueryResult = Apollo.QueryResult<GetAdminPromotionRulesQuery, GetAdminPromotionRulesQueryVariables>;
export const CreateAdminPromotionRuleDocument = gql`
    mutation CreateAdminPromotionRule($input: CreatePromotionRuleInput!) {
  createPromotionRule(input: $input) {
    id
    rankSpec
    targetCompetition {
      id
      name
      type
    }
  }
}
    `;
export type CreateAdminPromotionRuleMutationFn = Apollo.MutationFunction<CreateAdminPromotionRuleMutation, CreateAdminPromotionRuleMutationVariables>;

/**
 * __useCreateAdminPromotionRuleMutation__
 *
 * To run a mutation, you first call `useCreateAdminPromotionRuleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAdminPromotionRuleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAdminPromotionRuleMutation, { data, loading, error }] = useCreateAdminPromotionRuleMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateAdminPromotionRuleMutation(baseOptions?: Apollo.MutationHookOptions<CreateAdminPromotionRuleMutation, CreateAdminPromotionRuleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAdminPromotionRuleMutation, CreateAdminPromotionRuleMutationVariables>(CreateAdminPromotionRuleDocument, options);
      }
export type CreateAdminPromotionRuleMutationHookResult = ReturnType<typeof useCreateAdminPromotionRuleMutation>;
export type CreateAdminPromotionRuleMutationResult = Apollo.MutationResult<CreateAdminPromotionRuleMutation>;
export type CreateAdminPromotionRuleMutationOptions = Apollo.BaseMutationOptions<CreateAdminPromotionRuleMutation, CreateAdminPromotionRuleMutationVariables>;
export const DeleteAdminPromotionRuleDocument = gql`
    mutation DeleteAdminPromotionRule($id: ID!) {
  deletePromotionRule(id: $id) {
    id
  }
}
    `;
export type DeleteAdminPromotionRuleMutationFn = Apollo.MutationFunction<DeleteAdminPromotionRuleMutation, DeleteAdminPromotionRuleMutationVariables>;

/**
 * __useDeleteAdminPromotionRuleMutation__
 *
 * To run a mutation, you first call `useDeleteAdminPromotionRuleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAdminPromotionRuleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAdminPromotionRuleMutation, { data, loading, error }] = useDeleteAdminPromotionRuleMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteAdminPromotionRuleMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAdminPromotionRuleMutation, DeleteAdminPromotionRuleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAdminPromotionRuleMutation, DeleteAdminPromotionRuleMutationVariables>(DeleteAdminPromotionRuleDocument, options);
      }
export type DeleteAdminPromotionRuleMutationHookResult = ReturnType<typeof useDeleteAdminPromotionRuleMutation>;
export type DeleteAdminPromotionRuleMutationResult = Apollo.MutationResult<DeleteAdminPromotionRuleMutation>;
export type DeleteAdminPromotionRuleMutationOptions = Apollo.BaseMutationOptions<DeleteAdminPromotionRuleMutation, DeleteAdminPromotionRuleMutationVariables>;
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
export const GetAdminImagesDocument = gql`
    query GetAdminImages {
  images {
    id
    url
    status
  }
}
    `;

/**
 * __useGetAdminImagesQuery__
 *
 * To run a query within a React component, call `useGetAdminImagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminImagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminImagesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAdminImagesQuery(baseOptions?: Apollo.QueryHookOptions<GetAdminImagesQuery, GetAdminImagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAdminImagesQuery, GetAdminImagesQueryVariables>(GetAdminImagesDocument, options);
      }
export function useGetAdminImagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAdminImagesQuery, GetAdminImagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAdminImagesQuery, GetAdminImagesQueryVariables>(GetAdminImagesDocument, options);
        }
export function useGetAdminImagesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAdminImagesQuery, GetAdminImagesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAdminImagesQuery, GetAdminImagesQueryVariables>(GetAdminImagesDocument, options);
        }
export type GetAdminImagesQueryHookResult = ReturnType<typeof useGetAdminImagesQuery>;
export type GetAdminImagesLazyQueryHookResult = ReturnType<typeof useGetAdminImagesLazyQuery>;
export type GetAdminImagesSuspenseQueryHookResult = ReturnType<typeof useGetAdminImagesSuspenseQuery>;
export type GetAdminImagesQueryResult = Apollo.QueryResult<GetAdminImagesQuery, GetAdminImagesQueryVariables>;
export const GetAdminImageDocument = gql`
    query GetAdminImage($id: ID!) {
  image(id: $id) {
    id
    url
    status
  }
}
    `;

/**
 * __useGetAdminImageQuery__
 *
 * To run a query within a React component, call `useGetAdminImageQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminImageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminImageQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetAdminImageQuery(baseOptions: Apollo.QueryHookOptions<GetAdminImageQuery, GetAdminImageQueryVariables> & ({ variables: GetAdminImageQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAdminImageQuery, GetAdminImageQueryVariables>(GetAdminImageDocument, options);
      }
export function useGetAdminImageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAdminImageQuery, GetAdminImageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAdminImageQuery, GetAdminImageQueryVariables>(GetAdminImageDocument, options);
        }
export function useGetAdminImageSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAdminImageQuery, GetAdminImageQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAdminImageQuery, GetAdminImageQueryVariables>(GetAdminImageDocument, options);
        }
export type GetAdminImageQueryHookResult = ReturnType<typeof useGetAdminImageQuery>;
export type GetAdminImageLazyQueryHookResult = ReturnType<typeof useGetAdminImageLazyQuery>;
export type GetAdminImageSuspenseQueryHookResult = ReturnType<typeof useGetAdminImageSuspenseQuery>;
export type GetAdminImageQueryResult = Apollo.QueryResult<GetAdminImageQuery, GetAdminImageQueryVariables>;
export const CreateAdminImageUploadUrlDocument = gql`
    mutation CreateAdminImageUploadUrl($input: CreateImageUploadURLInput!) {
  createImageUploadURL(input: $input) {
    uploadUrl
    imageId
  }
}
    `;
export type CreateAdminImageUploadUrlMutationFn = Apollo.MutationFunction<CreateAdminImageUploadUrlMutation, CreateAdminImageUploadUrlMutationVariables>;

/**
 * __useCreateAdminImageUploadUrlMutation__
 *
 * To run a mutation, you first call `useCreateAdminImageUploadUrlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAdminImageUploadUrlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAdminImageUploadUrlMutation, { data, loading, error }] = useCreateAdminImageUploadUrlMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateAdminImageUploadUrlMutation(baseOptions?: Apollo.MutationHookOptions<CreateAdminImageUploadUrlMutation, CreateAdminImageUploadUrlMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAdminImageUploadUrlMutation, CreateAdminImageUploadUrlMutationVariables>(CreateAdminImageUploadUrlDocument, options);
      }
export type CreateAdminImageUploadUrlMutationHookResult = ReturnType<typeof useCreateAdminImageUploadUrlMutation>;
export type CreateAdminImageUploadUrlMutationResult = Apollo.MutationResult<CreateAdminImageUploadUrlMutation>;
export type CreateAdminImageUploadUrlMutationOptions = Apollo.BaseMutationOptions<CreateAdminImageUploadUrlMutation, CreateAdminImageUploadUrlMutationVariables>;
export const DeleteAdminImageDocument = gql`
    mutation DeleteAdminImage($id: ID!) {
  deleteImage(id: $id) {
    id
  }
}
    `;
export type DeleteAdminImageMutationFn = Apollo.MutationFunction<DeleteAdminImageMutation, DeleteAdminImageMutationVariables>;

/**
 * __useDeleteAdminImageMutation__
 *
 * To run a mutation, you first call `useDeleteAdminImageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAdminImageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAdminImageMutation, { data, loading, error }] = useDeleteAdminImageMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteAdminImageMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAdminImageMutation, DeleteAdminImageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAdminImageMutation, DeleteAdminImageMutationVariables>(DeleteAdminImageDocument, options);
      }
export type DeleteAdminImageMutationHookResult = ReturnType<typeof useDeleteAdminImageMutation>;
export type DeleteAdminImageMutationResult = Apollo.MutationResult<DeleteAdminImageMutation>;
export type DeleteAdminImageMutationOptions = Apollo.BaseMutationOptions<DeleteAdminImageMutation, DeleteAdminImageMutationVariables>;
export const GetAdminInformationsDocument = gql`
    query GetAdminInformations {
  Informations {
    id
    title
    content
  }
}
    `;

/**
 * __useGetAdminInformationsQuery__
 *
 * To run a query within a React component, call `useGetAdminInformationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminInformationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminInformationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAdminInformationsQuery(baseOptions?: Apollo.QueryHookOptions<GetAdminInformationsQuery, GetAdminInformationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAdminInformationsQuery, GetAdminInformationsQueryVariables>(GetAdminInformationsDocument, options);
      }
export function useGetAdminInformationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAdminInformationsQuery, GetAdminInformationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAdminInformationsQuery, GetAdminInformationsQueryVariables>(GetAdminInformationsDocument, options);
        }
export function useGetAdminInformationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAdminInformationsQuery, GetAdminInformationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAdminInformationsQuery, GetAdminInformationsQueryVariables>(GetAdminInformationsDocument, options);
        }
export type GetAdminInformationsQueryHookResult = ReturnType<typeof useGetAdminInformationsQuery>;
export type GetAdminInformationsLazyQueryHookResult = ReturnType<typeof useGetAdminInformationsLazyQuery>;
export type GetAdminInformationsSuspenseQueryHookResult = ReturnType<typeof useGetAdminInformationsSuspenseQuery>;
export type GetAdminInformationsQueryResult = Apollo.QueryResult<GetAdminInformationsQuery, GetAdminInformationsQueryVariables>;
export const GetAdminInformationDocument = gql`
    query GetAdminInformation($id: ID!) {
  Information(id: $id) {
    id
    title
    content
  }
}
    `;

/**
 * __useGetAdminInformationQuery__
 *
 * To run a query within a React component, call `useGetAdminInformationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminInformationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminInformationQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetAdminInformationQuery(baseOptions: Apollo.QueryHookOptions<GetAdminInformationQuery, GetAdminInformationQueryVariables> & ({ variables: GetAdminInformationQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAdminInformationQuery, GetAdminInformationQueryVariables>(GetAdminInformationDocument, options);
      }
export function useGetAdminInformationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAdminInformationQuery, GetAdminInformationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAdminInformationQuery, GetAdminInformationQueryVariables>(GetAdminInformationDocument, options);
        }
export function useGetAdminInformationSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAdminInformationQuery, GetAdminInformationQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAdminInformationQuery, GetAdminInformationQueryVariables>(GetAdminInformationDocument, options);
        }
export type GetAdminInformationQueryHookResult = ReturnType<typeof useGetAdminInformationQuery>;
export type GetAdminInformationLazyQueryHookResult = ReturnType<typeof useGetAdminInformationLazyQuery>;
export type GetAdminInformationSuspenseQueryHookResult = ReturnType<typeof useGetAdminInformationSuspenseQuery>;
export type GetAdminInformationQueryResult = Apollo.QueryResult<GetAdminInformationQuery, GetAdminInformationQueryVariables>;
export const CreateAdminInformationDocument = gql`
    mutation CreateAdminInformation($input: CreateInformationInput!) {
  createInformation(input: $input) {
    id
    title
    content
  }
}
    `;
export type CreateAdminInformationMutationFn = Apollo.MutationFunction<CreateAdminInformationMutation, CreateAdminInformationMutationVariables>;

/**
 * __useCreateAdminInformationMutation__
 *
 * To run a mutation, you first call `useCreateAdminInformationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAdminInformationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAdminInformationMutation, { data, loading, error }] = useCreateAdminInformationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateAdminInformationMutation(baseOptions?: Apollo.MutationHookOptions<CreateAdminInformationMutation, CreateAdminInformationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAdminInformationMutation, CreateAdminInformationMutationVariables>(CreateAdminInformationDocument, options);
      }
export type CreateAdminInformationMutationHookResult = ReturnType<typeof useCreateAdminInformationMutation>;
export type CreateAdminInformationMutationResult = Apollo.MutationResult<CreateAdminInformationMutation>;
export type CreateAdminInformationMutationOptions = Apollo.BaseMutationOptions<CreateAdminInformationMutation, CreateAdminInformationMutationVariables>;
export const UpdateAdminInformationDocument = gql`
    mutation UpdateAdminInformation($id: ID!, $input: UpdateInformationInput!) {
  updateInformation(id: $id, input: $input) {
    id
    title
    content
  }
}
    `;
export type UpdateAdminInformationMutationFn = Apollo.MutationFunction<UpdateAdminInformationMutation, UpdateAdminInformationMutationVariables>;

/**
 * __useUpdateAdminInformationMutation__
 *
 * To run a mutation, you first call `useUpdateAdminInformationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAdminInformationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAdminInformationMutation, { data, loading, error }] = useUpdateAdminInformationMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateAdminInformationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAdminInformationMutation, UpdateAdminInformationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAdminInformationMutation, UpdateAdminInformationMutationVariables>(UpdateAdminInformationDocument, options);
      }
export type UpdateAdminInformationMutationHookResult = ReturnType<typeof useUpdateAdminInformationMutation>;
export type UpdateAdminInformationMutationResult = Apollo.MutationResult<UpdateAdminInformationMutation>;
export type UpdateAdminInformationMutationOptions = Apollo.BaseMutationOptions<UpdateAdminInformationMutation, UpdateAdminInformationMutationVariables>;
export const DeleteAdminInformationDocument = gql`
    mutation DeleteAdminInformation($id: ID!) {
  deleteInformation(id: $id) {
    id
  }
}
    `;
export type DeleteAdminInformationMutationFn = Apollo.MutationFunction<DeleteAdminInformationMutation, DeleteAdminInformationMutationVariables>;

/**
 * __useDeleteAdminInformationMutation__
 *
 * To run a mutation, you first call `useDeleteAdminInformationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAdminInformationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAdminInformationMutation, { data, loading, error }] = useDeleteAdminInformationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteAdminInformationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAdminInformationMutation, DeleteAdminInformationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAdminInformationMutation, DeleteAdminInformationMutationVariables>(DeleteAdminInformationDocument, options);
      }
export type DeleteAdminInformationMutationHookResult = ReturnType<typeof useDeleteAdminInformationMutation>;
export type DeleteAdminInformationMutationResult = Apollo.MutationResult<DeleteAdminInformationMutation>;
export type DeleteAdminInformationMutationOptions = Apollo.BaseMutationOptions<DeleteAdminInformationMutation, DeleteAdminInformationMutationVariables>;
export const GetAdminLocationsDocument = gql`
    query GetAdminLocations {
  locations {
    id
    name
  }
}
    `;

/**
 * __useGetAdminLocationsQuery__
 *
 * To run a query within a React component, call `useGetAdminLocationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminLocationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminLocationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAdminLocationsQuery(baseOptions?: Apollo.QueryHookOptions<GetAdminLocationsQuery, GetAdminLocationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAdminLocationsQuery, GetAdminLocationsQueryVariables>(GetAdminLocationsDocument, options);
      }
export function useGetAdminLocationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAdminLocationsQuery, GetAdminLocationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAdminLocationsQuery, GetAdminLocationsQueryVariables>(GetAdminLocationsDocument, options);
        }
export function useGetAdminLocationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAdminLocationsQuery, GetAdminLocationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAdminLocationsQuery, GetAdminLocationsQueryVariables>(GetAdminLocationsDocument, options);
        }
export type GetAdminLocationsQueryHookResult = ReturnType<typeof useGetAdminLocationsQuery>;
export type GetAdminLocationsLazyQueryHookResult = ReturnType<typeof useGetAdminLocationsLazyQuery>;
export type GetAdminLocationsSuspenseQueryHookResult = ReturnType<typeof useGetAdminLocationsSuspenseQuery>;
export type GetAdminLocationsQueryResult = Apollo.QueryResult<GetAdminLocationsQuery, GetAdminLocationsQueryVariables>;
export const GetAdminLocationDocument = gql`
    query GetAdminLocation($id: ID!) {
  location(id: $id) {
    id
    name
  }
}
    `;

/**
 * __useGetAdminLocationQuery__
 *
 * To run a query within a React component, call `useGetAdminLocationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminLocationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminLocationQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetAdminLocationQuery(baseOptions: Apollo.QueryHookOptions<GetAdminLocationQuery, GetAdminLocationQueryVariables> & ({ variables: GetAdminLocationQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAdminLocationQuery, GetAdminLocationQueryVariables>(GetAdminLocationDocument, options);
      }
export function useGetAdminLocationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAdminLocationQuery, GetAdminLocationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAdminLocationQuery, GetAdminLocationQueryVariables>(GetAdminLocationDocument, options);
        }
export function useGetAdminLocationSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAdminLocationQuery, GetAdminLocationQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAdminLocationQuery, GetAdminLocationQueryVariables>(GetAdminLocationDocument, options);
        }
export type GetAdminLocationQueryHookResult = ReturnType<typeof useGetAdminLocationQuery>;
export type GetAdminLocationLazyQueryHookResult = ReturnType<typeof useGetAdminLocationLazyQuery>;
export type GetAdminLocationSuspenseQueryHookResult = ReturnType<typeof useGetAdminLocationSuspenseQuery>;
export type GetAdminLocationQueryResult = Apollo.QueryResult<GetAdminLocationQuery, GetAdminLocationQueryVariables>;
export const CreateAdminLocationDocument = gql`
    mutation CreateAdminLocation($input: CreateLocationInput!) {
  createLocation(input: $input) {
    id
    name
  }
}
    `;
export type CreateAdminLocationMutationFn = Apollo.MutationFunction<CreateAdminLocationMutation, CreateAdminLocationMutationVariables>;

/**
 * __useCreateAdminLocationMutation__
 *
 * To run a mutation, you first call `useCreateAdminLocationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAdminLocationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAdminLocationMutation, { data, loading, error }] = useCreateAdminLocationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateAdminLocationMutation(baseOptions?: Apollo.MutationHookOptions<CreateAdminLocationMutation, CreateAdminLocationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAdminLocationMutation, CreateAdminLocationMutationVariables>(CreateAdminLocationDocument, options);
      }
export type CreateAdminLocationMutationHookResult = ReturnType<typeof useCreateAdminLocationMutation>;
export type CreateAdminLocationMutationResult = Apollo.MutationResult<CreateAdminLocationMutation>;
export type CreateAdminLocationMutationOptions = Apollo.BaseMutationOptions<CreateAdminLocationMutation, CreateAdminLocationMutationVariables>;
export const UpdateAdminLocationDocument = gql`
    mutation UpdateAdminLocation($id: ID!, $input: UpdateLocationInput!) {
  updateLocation(id: $id, input: $input) {
    id
    name
  }
}
    `;
export type UpdateAdminLocationMutationFn = Apollo.MutationFunction<UpdateAdminLocationMutation, UpdateAdminLocationMutationVariables>;

/**
 * __useUpdateAdminLocationMutation__
 *
 * To run a mutation, you first call `useUpdateAdminLocationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAdminLocationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAdminLocationMutation, { data, loading, error }] = useUpdateAdminLocationMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateAdminLocationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAdminLocationMutation, UpdateAdminLocationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAdminLocationMutation, UpdateAdminLocationMutationVariables>(UpdateAdminLocationDocument, options);
      }
export type UpdateAdminLocationMutationHookResult = ReturnType<typeof useUpdateAdminLocationMutation>;
export type UpdateAdminLocationMutationResult = Apollo.MutationResult<UpdateAdminLocationMutation>;
export type UpdateAdminLocationMutationOptions = Apollo.BaseMutationOptions<UpdateAdminLocationMutation, UpdateAdminLocationMutationVariables>;
export const DeleteAdminLocationDocument = gql`
    mutation DeleteAdminLocation($id: ID!) {
  deleteLocation(id: $id) {
    id
  }
}
    `;
export type DeleteAdminLocationMutationFn = Apollo.MutationFunction<DeleteAdminLocationMutation, DeleteAdminLocationMutationVariables>;

/**
 * __useDeleteAdminLocationMutation__
 *
 * To run a mutation, you first call `useDeleteAdminLocationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAdminLocationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAdminLocationMutation, { data, loading, error }] = useDeleteAdminLocationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteAdminLocationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAdminLocationMutation, DeleteAdminLocationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAdminLocationMutation, DeleteAdminLocationMutationVariables>(DeleteAdminLocationDocument, options);
      }
export type DeleteAdminLocationMutationHookResult = ReturnType<typeof useDeleteAdminLocationMutation>;
export type DeleteAdminLocationMutationResult = Apollo.MutationResult<DeleteAdminLocationMutation>;
export type DeleteAdminLocationMutationOptions = Apollo.BaseMutationOptions<DeleteAdminLocationMutation, DeleteAdminLocationMutationVariables>;
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
    winnerTeam {
      id
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
export const GetAdminMeDocument = gql`
    query GetAdminMe {
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
 * __useGetAdminMeQuery__
 *
 * To run a query within a React component, call `useGetAdminMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAdminMeQuery(baseOptions?: Apollo.QueryHookOptions<GetAdminMeQuery, GetAdminMeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAdminMeQuery, GetAdminMeQueryVariables>(GetAdminMeDocument, options);
      }
export function useGetAdminMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAdminMeQuery, GetAdminMeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAdminMeQuery, GetAdminMeQueryVariables>(GetAdminMeDocument, options);
        }
export function useGetAdminMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAdminMeQuery, GetAdminMeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAdminMeQuery, GetAdminMeQueryVariables>(GetAdminMeDocument, options);
        }
export type GetAdminMeQueryHookResult = ReturnType<typeof useGetAdminMeQuery>;
export type GetAdminMeLazyQueryHookResult = ReturnType<typeof useGetAdminMeLazyQuery>;
export type GetAdminMeSuspenseQueryHookResult = ReturnType<typeof useGetAdminMeSuspenseQuery>;
export type GetAdminMeQueryResult = Apollo.QueryResult<GetAdminMeQuery, GetAdminMeQueryVariables>;
export const GetAdminScenesForTagsDocument = gql`
    query GetAdminScenesForTags {
  scenes {
    id
    name
  }
}
    `;

/**
 * __useGetAdminScenesForTagsQuery__
 *
 * To run a query within a React component, call `useGetAdminScenesForTagsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminScenesForTagsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminScenesForTagsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAdminScenesForTagsQuery(baseOptions?: Apollo.QueryHookOptions<GetAdminScenesForTagsQuery, GetAdminScenesForTagsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAdminScenesForTagsQuery, GetAdminScenesForTagsQueryVariables>(GetAdminScenesForTagsDocument, options);
      }
export function useGetAdminScenesForTagsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAdminScenesForTagsQuery, GetAdminScenesForTagsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAdminScenesForTagsQuery, GetAdminScenesForTagsQueryVariables>(GetAdminScenesForTagsDocument, options);
        }
export function useGetAdminScenesForTagsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAdminScenesForTagsQuery, GetAdminScenesForTagsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAdminScenesForTagsQuery, GetAdminScenesForTagsQueryVariables>(GetAdminScenesForTagsDocument, options);
        }
export type GetAdminScenesForTagsQueryHookResult = ReturnType<typeof useGetAdminScenesForTagsQuery>;
export type GetAdminScenesForTagsLazyQueryHookResult = ReturnType<typeof useGetAdminScenesForTagsLazyQuery>;
export type GetAdminScenesForTagsSuspenseQueryHookResult = ReturnType<typeof useGetAdminScenesForTagsSuspenseQuery>;
export type GetAdminScenesForTagsQueryResult = Apollo.QueryResult<GetAdminScenesForTagsQuery, GetAdminScenesForTagsQueryVariables>;
export const GetAdminSceneForTagDocument = gql`
    query GetAdminSceneForTag($id: ID!) {
  scene(id: $id) {
    id
    name
  }
}
    `;

/**
 * __useGetAdminSceneForTagQuery__
 *
 * To run a query within a React component, call `useGetAdminSceneForTagQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminSceneForTagQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminSceneForTagQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetAdminSceneForTagQuery(baseOptions: Apollo.QueryHookOptions<GetAdminSceneForTagQuery, GetAdminSceneForTagQueryVariables> & ({ variables: GetAdminSceneForTagQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAdminSceneForTagQuery, GetAdminSceneForTagQueryVariables>(GetAdminSceneForTagDocument, options);
      }
export function useGetAdminSceneForTagLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAdminSceneForTagQuery, GetAdminSceneForTagQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAdminSceneForTagQuery, GetAdminSceneForTagQueryVariables>(GetAdminSceneForTagDocument, options);
        }
export function useGetAdminSceneForTagSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAdminSceneForTagQuery, GetAdminSceneForTagQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAdminSceneForTagQuery, GetAdminSceneForTagQueryVariables>(GetAdminSceneForTagDocument, options);
        }
export type GetAdminSceneForTagQueryHookResult = ReturnType<typeof useGetAdminSceneForTagQuery>;
export type GetAdminSceneForTagLazyQueryHookResult = ReturnType<typeof useGetAdminSceneForTagLazyQuery>;
export type GetAdminSceneForTagSuspenseQueryHookResult = ReturnType<typeof useGetAdminSceneForTagSuspenseQuery>;
export type GetAdminSceneForTagQueryResult = Apollo.QueryResult<GetAdminSceneForTagQuery, GetAdminSceneForTagQueryVariables>;
export const CreateAdminSceneForTagDocument = gql`
    mutation CreateAdminSceneForTag($input: CreateSceneInput!) {
  createScene(input: $input) {
    id
    name
  }
}
    `;
export type CreateAdminSceneForTagMutationFn = Apollo.MutationFunction<CreateAdminSceneForTagMutation, CreateAdminSceneForTagMutationVariables>;

/**
 * __useCreateAdminSceneForTagMutation__
 *
 * To run a mutation, you first call `useCreateAdminSceneForTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAdminSceneForTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAdminSceneForTagMutation, { data, loading, error }] = useCreateAdminSceneForTagMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateAdminSceneForTagMutation(baseOptions?: Apollo.MutationHookOptions<CreateAdminSceneForTagMutation, CreateAdminSceneForTagMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAdminSceneForTagMutation, CreateAdminSceneForTagMutationVariables>(CreateAdminSceneForTagDocument, options);
      }
export type CreateAdminSceneForTagMutationHookResult = ReturnType<typeof useCreateAdminSceneForTagMutation>;
export type CreateAdminSceneForTagMutationResult = Apollo.MutationResult<CreateAdminSceneForTagMutation>;
export type CreateAdminSceneForTagMutationOptions = Apollo.BaseMutationOptions<CreateAdminSceneForTagMutation, CreateAdminSceneForTagMutationVariables>;
export const UpdateAdminSceneForTagDocument = gql`
    mutation UpdateAdminSceneForTag($id: ID!, $input: UpdateSceneInput!) {
  updateScene(id: $id, input: $input) {
    id
    name
  }
}
    `;
export type UpdateAdminSceneForTagMutationFn = Apollo.MutationFunction<UpdateAdminSceneForTagMutation, UpdateAdminSceneForTagMutationVariables>;

/**
 * __useUpdateAdminSceneForTagMutation__
 *
 * To run a mutation, you first call `useUpdateAdminSceneForTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAdminSceneForTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAdminSceneForTagMutation, { data, loading, error }] = useUpdateAdminSceneForTagMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateAdminSceneForTagMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAdminSceneForTagMutation, UpdateAdminSceneForTagMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAdminSceneForTagMutation, UpdateAdminSceneForTagMutationVariables>(UpdateAdminSceneForTagDocument, options);
      }
export type UpdateAdminSceneForTagMutationHookResult = ReturnType<typeof useUpdateAdminSceneForTagMutation>;
export type UpdateAdminSceneForTagMutationResult = Apollo.MutationResult<UpdateAdminSceneForTagMutation>;
export type UpdateAdminSceneForTagMutationOptions = Apollo.BaseMutationOptions<UpdateAdminSceneForTagMutation, UpdateAdminSceneForTagMutationVariables>;
export const DeleteAdminSceneForTagDocument = gql`
    mutation DeleteAdminSceneForTag($id: ID!) {
  deleteScene(id: $id) {
    id
  }
}
    `;
export type DeleteAdminSceneForTagMutationFn = Apollo.MutationFunction<DeleteAdminSceneForTagMutation, DeleteAdminSceneForTagMutationVariables>;

/**
 * __useDeleteAdminSceneForTagMutation__
 *
 * To run a mutation, you first call `useDeleteAdminSceneForTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAdminSceneForTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAdminSceneForTagMutation, { data, loading, error }] = useDeleteAdminSceneForTagMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteAdminSceneForTagMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAdminSceneForTagMutation, DeleteAdminSceneForTagMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAdminSceneForTagMutation, DeleteAdminSceneForTagMutationVariables>(DeleteAdminSceneForTagDocument, options);
      }
export type DeleteAdminSceneForTagMutationHookResult = ReturnType<typeof useDeleteAdminSceneForTagMutation>;
export type DeleteAdminSceneForTagMutationResult = Apollo.MutationResult<DeleteAdminSceneForTagMutation>;
export type DeleteAdminSceneForTagMutationOptions = Apollo.BaseMutationOptions<DeleteAdminSceneForTagMutation, DeleteAdminSceneForTagMutationVariables>;
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