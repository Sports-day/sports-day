import {
    Box,
    Button,
    Stack,
    Container,
    SwipeableDrawer,
    Typography,
    useTheme, Avatar, Card
} from "@mui/material";
import * as React from "react";
import {useMemo} from "react";
import {HiOutlineExclamationTriangle, HiUser} from "react-icons/hi2";
import type { GetPanelCompetitionsQuery, GetPanelTeamsQuery, GetPanelMatchesQuery } from "@/src/gql/__generated__/graphql";
import type { ResolvedUser } from "@/src/features/users/hook";
import {UserMatchList} from "@/components/match/userMatchList";
import {useFetchSports} from "@/src/features/sports/hook";

type PanelUser = ResolvedUser;
type PanelCompetition = GetPanelCompetitionsQuery["competitions"][number];
type PanelTeam = GetPanelTeamsQuery["teams"][number];
type PanelMatch = GetPanelMatchesQuery["matches"][number];

export type DiscoverUserProps = {
    user: PanelUser
    games: PanelCompetition[]
    teams: PanelTeam[]
    matches: PanelMatch[]
}

export const DiscoverUser = (props: DiscoverUserProps) => {
    const theme = useTheme();
    const [open, toggleDrawer] = React.useState(false);
    const {sports} = useFetchSports();

    // Find the team that the user belongs to
    const userTeam = useMemo(
        () => props.teams.find(team => team.users.some(u => u.id === props.user.id)),
        [props.teams, props.user.id]
    );
    const userMatches = useMemo(
        () => props.matches.filter(match => {
            const teamIds = match.entries.map(e => e.team?.id);
            return teamIds.includes(userTeam?.id);
        }),
        [props.matches, userTeam?.id]
    );
    const userMatchSports = useMemo(() => {
        const sceneIds = userMatches.map(match => match.competition.scene.id);
        return sports.filter(sport =>
            sport.scene?.some(ss => sceneIds.includes(ss.scene.id))
        );
    }, [userMatches, sports]);
    const userMatchSport = userMatchSports[0];

    return(
        <>
            <Button
                variant={"contained"}
                color={"secondary"}
                sx={{
                    width: "100%",
                    border: `1px solid ${theme.palette.secondary.dark}66`,
                    pt:1.4,
                    pb:1.8,
                    mb:1
                }}
                onClick={() => toggleDrawer(true)}
            >
                <Stack
                    direction={"row"}
                    spacing={3} ml={0.4}
                    alignItems={"center"}
                    justifyContent={"start"}
                    sx={{width:"100%"}}
                >
                    <Avatar
                        alt={"unknown"}
                        sx={{
                            height: "1.5em",
                            width: "1.5em",
                            backgroundColor: theme.palette.text.secondary,
                        }}
                    >
                        <HiUser/>
                    </Avatar>
                    <Typography noWrap color={theme.palette.text.primary} sx={{ minWidth: 0, flex: 1 }}>
                        {props.user.name}
                    </Typography>

                </Stack>
            </Button>
            <SwipeableDrawer
                anchor="bottom"
                open={open}
                onClose={() => toggleDrawer(false)}
                onOpen={() => toggleDrawer(true)}
                swipeAreaWidth={5}
                disableSwipeToOpen={true}
                ModalProps={{
                    keepMounted: true,
                }}
                PaperProps={{elevation: 0, style: {backgroundColor: "transparent"}}}
            >
                <Box
                    sx={{
                        width: '100%',
                        height: 'auto',
                        background: `${theme.palette.secondary.main}FC`,
                        backdropFilter: 'blur(30px)',
                        borderRadius: "15px",
                        borderBottomLeftRadius: "0px",
                        borderBottomRightRadius: "0px",
                        color: '#E8EBF8',
                        pb: 5,
                        pt: 1.5
                    }}
                >
                    <Container maxWidth={"xl"}>
                        <Stack spacing={1}>
                            <Stack direction={"column"} spacing={2} justifyContent={"center"}
                                   alignItems={"center"}>
                                <Box sx={{
                                    width: 50,
                                    height: 6,
                                    borderRadius: 3,
                                    backgroundColor: `${theme.palette.text.primary}4D`
                                }}></Box>
                                <Card sx={{backgroundColor: `${theme.palette.secondary.dark}80`,}}>
                                    <Stack direction={"row"} px={2} py={1} spacing={3} ml={0.4}
                                           alignItems={"center"}>
                                        <Avatar
                                            alt={"unknown"}
                                            sx={{
                                                height: "1.5em",
                                                width: "1.5em",
                                                backgroundColor: theme.palette.text.secondary,
                                            }}
                                        >
                                            <HiUser/>
                                        </Avatar>
                                        <Typography noWrap color={theme.palette.text.primary} sx={{ minWidth: 0, flex: 1 }}>
                                            {props.user.name} さん
                                        </Typography>
                                    </Stack>
                                </Card>
                            </Stack>
                            <Card
                                sx={{backgroundColor: `${theme.palette.secondary.dark}FF`,
                                    py:2, px: 2}}>
                                <Stack direction={"row"} spacing={2} alignItems={"center"}>
                                    <Avatar
                                        alt={userMatchSport?.name}
                                        sx={{
                                            height: "2em", width: "2em",
                                            backgroundColor: `${theme.palette.text.secondary}`,
                                        }}
                                        src={userMatchSport?.image?.url ?? undefined}
                                    >
                                        {!userMatchSport?.image && <HiOutlineExclamationTriangle fontSize={"30px"}/>}
                                    </Avatar>
                                    <Stack>
                                        <Typography noWrap fontSize={"14px"} sx={{color: theme.palette.text.primary}}>
                                            {props.user.name}の競技
                                        </Typography>
                                        {userMatchSports.map((sport) => (
                                            <Typography noWrap fontSize={"14px"} fontWeight={"600"} key={sport.id}>
                                                {sport.name}
                                            </Typography>
                                        ))}
                                    </Stack>
                                </Stack>
                            </Card>
                            <UserMatchList userId={props.user.id}/>
                        </Stack>
                    </Container>
                </Box>
            </SwipeableDrawer>
        </>
    )
}
