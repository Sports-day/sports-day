import {createContext} from "react";
import type {
    GetPanelTeamsQuery,
    GetPanelCompetitionsQuery,
    GetPanelMatchesQuery,
    GetPanelLocationsQuery,
    GetPanelImagesQuery,
} from "@/src/gql/__generated__/graphql";
import type { ResolvedUser } from "@/src/features/users/hook";

type PanelUser = ResolvedUser;
type PanelTeam = GetPanelTeamsQuery["teams"][number];
type PanelCompetition = GetPanelCompetitionsQuery["competitions"][number];
type PanelMatch = GetPanelMatchesQuery["matches"][number];
type PanelLocation = GetPanelLocationsQuery["locations"][number];
type PanelImage = GetPanelImagesQuery["images"][number];

export type GenericContextType<T> = {
    data: T
    refresh: VoidFunction
}

export type UsersContextType = GenericContextType<PanelUser[]>
export const UsersContext = createContext<UsersContextType>({
    data: [],
    refresh: () => {}
})

export type TeamsContextType = GenericContextType<PanelTeam[]>
export const TeamsContext = createContext<TeamsContextType>({
    data: [],
    refresh: () => {}
})

export type GamesContextType = GenericContextType<PanelCompetition[]>
export const GamesContext = createContext<GamesContextType>({
    data: [],
    refresh: () => {}
})


export type MatchesContextType = GenericContextType<PanelMatch[]>
export const MatchesContext = createContext<MatchesContextType>({
    data: [],
    refresh: () => {}
})

export type LocationsContextType = GenericContextType<PanelLocation[]>
export const LocationsContext = createContext<LocationsContextType>({
    data: [],
    refresh: () => {}
})

export type ImagesContextType = GenericContextType<PanelImage[]>
export const ImagesContext = createContext<ImagesContextType>({
    data: [],
    refresh: () => {}
})
