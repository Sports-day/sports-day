import {Sport} from "../../../models/SportModel";
import {Team} from "../../../models/TeamModel";
import {Match} from "../../../models/MatchModel";
import {Game, gameFactory} from "../../../models/GameModel";
import {Image} from "../../../models/ImageModel";
import {Location} from "../../../models/LocationModel";
import {useContext, useState} from "react";
import {useFetchImages} from "../../images/hook";
import {useFetchLocations} from "../../locations/hook";
import {useFetchTeams} from "../../teams/hook";
import {useFetchSport, useFetchSports} from "../../sports/hook";
import {useFetchGames} from "../../games/hook";
import {useFetchMatches} from "../../matches/hook";
import {useFetchUsers} from "../../users/hook";
import {User} from "../../../models/UserModel";
import {MicrosoftAccountContext} from "../../../../components/context";

export type SportDataType = {
    isFetching: boolean
    //  data
    sport: Sport
    //  image
    image: Image | undefined
    //  belong to sport
    games: Game[]
    //  belong to games
    teams: Team[]
    //  belong to games
    matches: Match[]
    locations: Location[]
}

export const useFetchSportData = (sportId: number) => {
    //  hook
    const {sport, isFetching: isFetchingSport} = useFetchSport(sportId)
    const {images, isFetching: isFetchingImages} = useFetchImages()
    const {locations, isFetching: isFetchingLocations} = useFetchLocations()
    const {teams, isFetching: isFetchingTeams} = useFetchTeams()
    const {games, isFetching: isFetchingGames} = useFetchGames()
    const {matches, isFetching: isFetchingMatches} = useFetchMatches()
    //  state
    let filteredGames: Game[] = []
    let filteredTeams: Team[] = []
    let filteredMatches: Match[] = []

    //  games
    filteredGames = games.filter((game: Game) => {
        return game.sportId === sportId
    })

    //  matches
    filteredMatches = matches.filter((match: Match) => {
        return filteredGames.some((game: Game) => {
            return game.id === match.gameId
        })
    })

    //  teams
    filteredTeams = teams.filter((team: Team) => {
        return filteredMatches.some((match: Match) => {
            return match.leftTeamId === team.id || match.rightTeamId === team.id
        })
    })

    return {
        isFetching: isFetchingSport || isFetchingImages || isFetchingLocations || isFetchingTeams || isFetchingGames || isFetchingMatches,
        locations: locations,
        image: images.find((image: Image) => sport?.iconId === image.id),
        sport: sport,
        games: filteredGames,
        teams: filteredTeams,
        matches: filteredMatches,
    } as SportDataType
}