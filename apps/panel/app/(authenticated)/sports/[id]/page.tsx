import {
    Avatar,
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, LinearProgress,
    Stack,
    SvgIcon,
    Typography,
    Grid,
    useTheme
} from "@mui/material";
import {GameProgress} from "@/components/game/game-progress";
import {
    HiOutlineClipboardDocumentList,
    HiOutlineExclamationTriangle,
    HiTableCells,
    HiUsers,
    HiXMark
} from "react-icons/hi2";
import * as React from "react";
import {GameList} from "@/components/game/GameList"
import {GamesContext, LocationsContext, MatchesContext, TeamsContext, UsersContext} from "@/components/context";
import {useMemo, useEffect, useState} from "react";
import {DialogProps} from '@mui/material/Dialog';
import {Rules} from "@/components/rules/Rules";
import {useInterval} from "react-use";
import {useFetchSport} from "@/src/features/sports/hook";
import {useFetchGames} from "@/src/features/games/hook";
import {useFetchTeams} from "@/src/features/teams/hook";
import {useFetchLocations} from "@/src/features/locations/hook";
import {useFetchMatches} from "@/src/features/matches/hook";
import {useFetchUsers} from "@/src/features/users/hook";
import {useFetchUserinfo} from "@/src/features/userinfo/hook";
import CircleContainer from "@/components/layouts/circleContainer";
import {motion} from "framer-motion";
import { useParams } from "react-router-dom";

const REFRESH_INTERVAL = 1000 * 60 * 5

export default function Page() {
    const { id } = useParams<{ id: string }>()
    const sportId = id ?? '0'
    const theme = useTheme()
    //  fetch
    const {sport, isFetching: isSportFetching, refresh: refreshSport} = useFetchSport(sportId)
    const {games: allGames, isFetching: isGameFetching, refresh: refreshGame} = useFetchGames()
    const {matches, isFetching: isMatchesFetching, refresh: refreshMatches} = useFetchMatches()
    const {teams, isFetching: isTeamFetching, refresh: refreshTeam} = useFetchTeams()
    const {locations, isFetching: isLocationsFetching, refresh: refreshLocations} = useFetchLocations()
    const {users, isFetching: isUsersFetching, refresh: refreshUsers} = useFetchUsers()
    const {user, isFetching: isUserFetching} = useFetchUserinfo()

    // sport.scene のシーンIDに一致するgamesをフィルタ
    const games = useMemo(() => {
        const sceneIds = new Set((sport?.scene ?? []).map(ss => ss.scene.id))
        return allGames.filter(game => sceneIds.has(game.scene.id))
    }, [allGames, sport])

    // ユーザーのチームを取得
    const myTeams = useMemo(() =>
        teams.filter(team => team.users.some(u => u.id === user?.id)),
    [teams, user])

    // ユーザーが参加しているゲーム（チームがcompetitionにエントリーされている）
    const myGames = useMemo(() => {
        const myTeamIds = new Set(myTeams.map(t => t.id))
        return games.filter(game =>
            game.teams.some(t => myTeamIds.has(t.id))
        )
    }, [games, myTeams])

    const myGame = myGames[0]
    const myTeam = useMemo(() => {
        if (!myGame) return undefined
        const gameTeamIds = new Set(myGame.teams.map(t => t.id))
        return myTeams.find(team => gameTeamIds.has(team.id))
    }, [myGame, myTeams])

    //  state
    const [open, setOpen] = useState(false);
    const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
    const [focusedGameId, setFocusedGameId] = useState<string | null>(null)

    const isFetching = isSportFetching || isGameFetching || isTeamFetching || isLocationsFetching || isMatchesFetching || isUsersFetching || isUserFetching
    const refresh = () => {
        refreshSport()
        refreshGame()
        refreshTeam()
        refreshLocations()
        refreshUsers()
        refreshMatches()
    }

    useEffect(() => {
        if (sport?.name) {
            document.title = `SPORTSDAY : ${sport.name}`
        }
        return () => {
            document.title = 'Sports-day'
        }
    }, [sport?.name])

    //  set focusedGameId when games is loaded
    if (!isFetching && focusedGameId === null) {
        if (games.length > 0) {
            setFocusedGameId(games[0].id)
        }
    }

    useInterval(
        () => {
            refresh()
        },
        REFRESH_INTERVAL
    )

    const handleClickOpen = (scrollType: DialogProps['scroll']) => () => {
        setOpen(true);
        setScroll(scrollType);
    };
    const handleClose = () => {
        setOpen(false);
    };

    {isFetching && (
        <motion.div
            key={"loading"}
            initial={{opacity: 0, y:-150}}
            animate={{opacity: 0.5, y:0}}
            exit={{opacity: 0}}
            transition={{duration: 1, ease: [0, 0.5, 0, 1]}}
        >
            <CircleContainer>
                <Container maxWidth={"xl"}>
                    <Box py={7} px={2}>
                        <LinearProgress />
                    </Box>
                </Container>
            </CircleContainer>
        </motion.div>
    )}

    if (!sport) {
        return null
    }

    return (
        <>
            <GamesContext.Provider
                value={{
                    data: games,
                    refresh: () => {
                    }
                }}
            >
                <MatchesContext.Provider
                    value={{
                        data: matches,
                        refresh: () => {
                        }
                    }}
                >
                    <TeamsContext.Provider
                        value={{
                            data: teams,
                            refresh: () => {
                            }
                        }}
                    >
                        <LocationsContext.Provider
                            value={{
                                data: locations,
                                refresh: () => {
                                }
                            }}
                        >
                            <UsersContext.Provider
                                value={{
                                    data: users,
                                    refresh: () => {
                                    }
                                }}
                            >
                            <Box
                                component={"main"}
                                minHeight={"96vh"}
                                sx={{
                                    flexGrow: 1,
                                    pb: 5,
                                    overflow: "hidden"
                                }}
                            >

                                {/*MainVisual*/}
                                <CircleContainer>
                                    <Container
                                        maxWidth={"xl"}
                                    >
                                        <Stack
                                            direction={"row"}
                                            justifyContent={"center"}
                                            alignItems={"center"}
                                            spacing={3}
                                            py={2}
                                            sx={{
                                                height:"100%"
                                            }}
                                        >
                                            <Avatar
                                                alt={sport.name}
                                                sx={{height: "2.5em", width: "2.5em"}}
                                                src={sport.image?.url ?? undefined}
                                            >
                                                {!sport.image && <HiOutlineExclamationTriangle fontSize={"30px"}/>}
                                            </Avatar>
                                            <Typography sx={{
                                                color: theme.palette.text.primary,
                                                fontSize: "20px",
                                                fontWeight: "bold"
                                            }}>
                                                {sport.name}
                                            </Typography>
                                        </Stack>
                                        <Grid container spacing={1}>
                                            {myTeam &&
                                                <>
                                                    <Grid size={5.5}>
                                                        <Box
                                                            px={2}
                                                            py={2}
                                                            pr={2}
                                                            sx={{
                                                                width: "100%",
                                                                height:"86px",
                                                                borderRadius: "12px",
                                                                backgroundColor: `${theme.palette.secondary.light}33`,
                                                                border: `1px solid ${theme.palette.secondary.dark}66`,
                                                            }}>
                                                            <Stack
                                                                direction={"row"}
                                                                justifyContent={"space-between"}
                                                                alignItems={"center"}
                                                                sx={{width: "100%", height: "100%"}}
                                                            >
                                                                <Stack
                                                                    direction={"column"}
                                                                    justifyContent={"center"}
                                                                    alignItems={"flex-start"}
                                                                >
                                                                    <Typography sx={{fontSize: "14px"}}>
                                                                        あなたのチーム
                                                                    </Typography>
                                                                    <Typography>
                                                                        {myTeam?.name}
                                                                    </Typography>
                                                                </Stack>
                                                                <SvgIcon>
                                                                    <HiUsers color="#99a5d6"/>
                                                                </SvgIcon>
                                                            </Stack>
                                                        </Box>
                                                    </Grid>
                                                    <Grid size={6.5}>
                                                        <Box
                                                            px={2}
                                                            py={2}
                                                            pr={2}
                                                            sx={{
                                                                width: "100%",
                                                                height:"86px",
                                                                borderRadius: "12px",
                                                                backgroundColor: `${theme.palette.secondary.light}33`,
                                                                border: `1px solid ${theme.palette.secondary.dark}66`,
                                                            }}>
                                                            <Stack
                                                                direction={"row"}
                                                                justifyContent={"space-between"}
                                                                alignItems={"center"}
                                                                sx={{width: "100%", height: "100%"}}
                                                            >
                                                                <Stack
                                                                    direction={"column"}
                                                                    justifyContent={"center"}
                                                                    alignItems={"flex-start"}
                                                                >
                                                                    <Typography fontSize={"14px"}>
                                                                        あなたのリーグ
                                                                    </Typography>
                                                                    <Typography>
                                                                        {myGame?.name}
                                                                    </Typography>
                                                                </Stack>
                                                                <SvgIcon>
                                                                    <HiTableCells color="#99a5d6"/>
                                                                </SvgIcon>
                                                            </Stack>
                                                        </Box>
                                                    </Grid>
                                                </>
                                            }
                                            <Grid size={6.5}>
                                                <Box
                                                    px={2}
                                                    py={1.5}
                                                    pr={2}
                                                    sx={{
                                                        width: "100%",
                                                        height:"75px",
                                                        borderRadius: "12px",
                                                        backgroundColor: `${theme.palette.secondary.light}33`,
                                                        border: `1px solid ${theme.palette.secondary.dark}66`,
                                                    }}>
                                                    <GameProgress sportsId={sport.id}/>
                                                </Box>
                                            </Grid>
                                            <Grid size={5.5}>
                                                <Button
                                                    variant={"contained"}
                                                    color={"secondary"}
                                                    sx={{
                                                        width: "100%", height: "75px",
                                                        backgroundColor: `${theme.palette.secondary.light}66`,
                                                        border: `1px solid ${theme.palette.secondary.dark}66`,
                                                    }}
                                                    onClick={handleClickOpen('paper')}
                                                >
                                                    <Stack
                                                        direction={"row"}
                                                        justifyContent={"space-between"}
                                                        alignItems={"center"}
                                                        spacing={1}
                                                        sx={{
                                                            color: theme.palette.text.primary,
                                                            width:"100%"
                                                        }}
                                                    >
                                                        <Typography fontSize={"14px"}>
                                                            ルールを見る
                                                        </Typography>
                                                        <SvgIcon>
                                                            <HiOutlineClipboardDocumentList/>
                                                        </SvgIcon>
                                                    </Stack>
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Container>
                                </CircleContainer>

                                <Dialog
                                    fullScreen
                                    open={open}
                                    onClose={handleClose}
                                    scroll={scroll}
                                    aria-labelledby="scroll-dialog-title"
                                    aria-describedby="scroll-dialog-description"
                                    sx={{
                                        "& .MuiDialog-container": {
                                            "& .MuiPaper-root": {
                                                width: "100vw",
                                                maxWidth: "lg",
                                                background: theme.palette.background.paper,
                                            },
                                        },
                                    }}
                                >
                                    <DialogTitle id="scroll-dialog-title" fontSize={"16px"}
                                                 color={theme.palette.text.primary}>{sport.name}のルール</DialogTitle>
                                    <DialogContent dividers={scroll === 'paper'}>
                                        <Rules rules={sport.rules ?? []}/>
                                    </DialogContent>
                                    <DialogActions sx={{mb:3}}>
                                        <Stack
                                            direction={"row"}
                                            justifyContent={"center"}
                                            alignItems={"center"}
                                            spacing={2}
                                            sx={{width: "100%", height:"40px"}}
                                        >
                                            <Button sx={{width: "100%"}}
                                                    onClick={handleClose}>
                                                <SvgIcon sx={{mr: 1}}>
                                                    <HiXMark color={theme.palette.text.primary}/>
                                                </SvgIcon>
                                                <Typography color={theme.palette.text.primary}>閉じる</Typography>
                                            </Button>
                                        </Stack>
                                    </DialogActions>
                                </Dialog>

                                <Container
                                    maxWidth={"xl"}
                                    sx={{px: 2, py: 3,mb:5, mt: "-100px"}}
                                >
                                    <GameList
                                        games={games}
                                        gameId={focusedGameId}
                                        setGameId={setFocusedGameId}
                                        myTeamId={myTeam?.id}
                                    />
                                </Container>

                            </Box>
                            </UsersContext.Provider>
                        </LocationsContext.Provider>
                    </TeamsContext.Provider>
                </MatchesContext.Provider>
            </GamesContext.Provider>
        </>
    )
}
