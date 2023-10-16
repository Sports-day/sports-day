import {useFetchMyUser, useFetchUsers} from "../../users/hook";
import {useFetchTeams} from "../../teams/hook";
import {useFetchGames} from "../../games/hook";
import {useFetchSports} from "../../sports/hook";
import {Class} from "../../../models/ClassModel";
import {Team} from "../../../models/TeamModel";
import {Sport} from "../../../models/SportModel";
import {Game} from "../../../models/GameModel";
import {useState} from "react";
import {useFetchClasses} from "../../classes/hooks";
import {User} from "../../../models/UserModel";
import {Match} from "../../../models/MatchModel";
import {useFetchMatches} from "../../matches/hook";

export type MatchSet = {
    match: Match,
    team: Team,
    members: User[],
    sport: Sport,
    game: Game,
}

export type TeamSetsInMyClassResponse = {
    isFetching: boolean
    isSuccessful: boolean
    myClass: Class | undefined
    users: User[]
    matchSets: MatchSet[]
}

export const useFetchTeamSetsInMyClass = () => {
    const {users, isFetching: isFetchingUsers} = useFetchUsers()
    const {teams, isFetching: isFetchingTeams} = useFetchTeams()
    const {games, isFetching: isFetchingGames} = useFetchGames()
    const {sports, isFetching: isFetchingSports} = useFetchSports()
    const {matches, isFetching: isFetchingMatches} = useFetchMatches()
    const {classes, isFetching: isFetchingClasses} = useFetchClasses()
    const {user, isFetching: isFetchingMyUser} = useFetchMyUser()

    //  state
    const [isFetching, setIsFetching] = useState<boolean>(true)
    const [isSuccessfulState, setIsSuccessfulState] = useState<boolean>(false)
    const [myClassState, setMyClassState] = useState<Class | undefined>(undefined)
    const [matchSetListState, setMatchSetListState] = useState<MatchSet[]>([])

    if (!isFetchingUsers && !isFetchingTeams && !isFetchingGames && !isFetchingSports && !isFetchingMatches && !isFetchingClasses && !isFetchingMyUser && isFetching) {
        fetchBlock: {
            if (!user) break fetchBlock
            const findMyClass = classes.find((c) => c.id === user?.classId)
            if (!findMyClass) break fetchBlock
            setMyClassState(findMyClass)

            //  find teams belong to same class
            const findTeams = teams.filter((t) => t.classId === findMyClass.id)

            const matchSetList: MatchSet[] = []

            for (const team of findTeams) {
                //  find members
                const findMembers = users.filter((u) => team.userIds.includes(u.id))
                //  find matches
                const findMatches = matches
                    .filter((m) => m.leftTeamId === team.id || m.rightTeamId === team.id)
                    .filter((m) => m.status !== "finished")

                //  construct match set
                for (const match of findMatches) {
                    //  find sport and game
                    const findSport = sports.find((s) => s.id === match.sportId)
                    const findGame = games.find((g) => g.id === match.gameId)

                    //  construct match set
                    const matchSet = {
                        match,
                        team,
                        members: findMembers,
                        sport: findSport,
                        game: findGame,
                    } as MatchSet

                    //  push
                    matchSetList.push(matchSet)
                }
            }

            //  sort by match start time
            const sortedMatchSetList = matchSetList.sort((a, b) => {
                return a.match.startAt.localeCompare(b.match.startAt)
            })

            //  set state
            setMatchSetListState(sortedMatchSetList)

            setIsSuccessfulState(true)
        }

        setIsFetching(false)
    }

    return {
        isFetching,
        isSuccessful: isSuccessfulState,
        myClass: myClassState,
        users: users,
        matchSets: matchSetListState,
    } as TeamSetsInMyClassResponse
}