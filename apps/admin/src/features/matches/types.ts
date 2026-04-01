export type ActiveLeague = {
  id: string
  name: string
  teams: ActiveTeam[]
  matches: ActiveMatch[]
}

export type ActiveTeam = {
  id: string
  name: string
  shortName: string
}

export type ActiveMatch = {
  id: string
  teamAId: string
  teamBId: string
  scoreA: number | null
  scoreB: number | null
  status: 'standby' | 'ongoing' | 'finished' | 'cancelled'
  winner?: 'teamA' | 'teamB' | 'draw'
  time?: string
  note?: string
  referee?: string
  location?: string
  startTime?: string
}
