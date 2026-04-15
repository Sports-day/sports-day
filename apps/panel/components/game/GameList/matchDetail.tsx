import {
    Avatar,
    Box,
    Button,
    Card, Chip,
    Container, LinearProgress, linearProgressClasses,
    Stack, styled, SvgIcon,
    Typography,
} from "@mui/material";
import * as React from "react";
import {Fragment, useContext} from "react";
import type { GetPanelMatchesQuery } from "@/src/gql/__generated__/graphql";
import { MatchStatus } from "@/src/gql/__generated__/graphql";
import {
    HiArrowRight,
    HiClock,
    HiFlag,
    HiMapPin,
    HiUser,
} from "react-icons/hi2";
import {ThemeProvider, useTheme} from "@mui/material/styles";
import {UsersContext} from "../../context";
import { Link } from "react-router-dom";

type PanelMatch = GetPanelMatchesQuery["matches"][number];

export type MatchDetailProps = {
    match: PanelMatch;
    dashboard?: boolean;
}

export const MatchDetail = (props: MatchDetailProps) => {
    const theme = useTheme();
    const {data: users} = useContext(UsersContext);

    const leftEntry = props.match.entries[0];
    const rightEntry = props.match.entries[1];
    const leftTeamId = leftEntry?.team?.id ?? null;
    const rightTeamId = rightEntry?.team?.id ?? null;
    const leftTeamName = leftEntry?.team?.name ?? null;
    const rightTeamName = rightEntry?.team?.name ?? null;
    const leftScore = leftEntry?.score ?? 0;
    const rightScore = rightEntry?.score ?? 0;

    //  team is null
    if (!leftTeamId || !rightTeamId) return null;

    // judge
    const judgeTeamId = props.match.judgment?.team?.id ?? null;
    const judgeTeamName = props.match.judgment?.team?.name ?? "ルール参照";

    //  time and location (match に既にネストされている)
    const formattedTime = new Date(props.match.time).toLocaleTimeString("ja-JP", {
        hour: '2-digit',
        minute: '2-digit'
    });
    const locationName = props.match.location?.name;

    const PointBar = styled(LinearProgress)(({}) => ({
        height: 4.5,
        borderRadius: 2,
        [`&.${linearProgressClasses.colorPrimary}`]: {backgroundColor: `${theme.palette.text.disabled}33`,},
        [`& .${linearProgressClasses.bar}`]: {borderRadius: 2, backgroundColor: theme.palette.text.primary,},
    }));
    const maxScore = leftScore > rightScore ? leftScore : rightScore;
    const barOffset = (maxScore == 0) ? 1 : (95 / maxScore)

    let matchStatus;
    switch (props.match.status) {
        case MatchStatus.Standby:
            matchStatus = "開始前";
            break;
        case MatchStatus.Ongoing:
            matchStatus = "進行中";
            break;
        case MatchStatus.Finished:
            matchStatus = "完了";
            break;
        case MatchStatus.Canceled:
            matchStatus = "中止";
            break;
        default:
            matchStatus = "状態不明";
    }

    let statusColor;
    switch (props.match.status) {
        case MatchStatus.Standby:
            statusColor = `${theme.palette.text.primary}1A`;
            break;
        case MatchStatus.Ongoing:
            statusColor = `${theme.palette.warning.main}33`;
            break;
        case MatchStatus.Finished:
            statusColor = `${theme.palette.success.main}33`;
            break;
        case MatchStatus.Canceled:
            statusColor = `${theme.palette.error.main}33`;
            break;
        default:
            statusColor = `${theme.palette.secondary.main}33`;
    }

    return (
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
                pt: 1.5,
                mt:3
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
                        <Typography
                            color={theme.palette.text.primary}
                            textAlign={"center"}
                        >
                            試合の詳細
                        </Typography>
                    </Stack>
                    <Box
                        sx={{
                            pb: 2,
                            px: 2,
                            mx:1,
                            pt:0.5,
                            display:"flex",
                            borderRadius: "12px",
                            borderBottomLeftRadius: "0px",
                            borderBottomRightRadius: "0px",
                            border:`1px solid ${statusColor}`,
                            backgroundColor: statusColor,
                            justifyContent: "center",
                            alignItems: "center",
                            position:"relative",
                            top:"20px",
                            zIndex: -1
                        }}
                    >
                        <Typography color={theme.palette.text.primary} fontSize={"14px"}
                                    fontWeight={"600"}>
                            状態：{matchStatus}
                        </Typography>
                    </Box>
                    <Card
                        sx={{backgroundColor: `${theme.palette.secondary.dark}FF`,
                            boxShadow: `0px 0px 15px ${theme.palette.info.main}4D`,
                            pt:1, pb:1.5, px: 1}}>
                        <Stack
                            direction={"row"}
                            spacing={1}
                            sx={{width: "100%", height: "100%"}}
                            alignItems={"flex-start"}
                        >
                            <Stack
                                sx={{width: "100%"}}
                                direction={"row"}
                                spacing={1}
                                justifyContent={"space-around"}
                                alignItems={"center"}
                            >
                                <Stack
                                    direction={"row"}
                                    justifyContent={"start"}
                                    alignItems={"center"}
                                    spacing={2}
                                >
                                    <Typography sx={{color: theme.palette.text.primary, fontSize: "20px", fontWeight: "bold"}}>
                                        {leftScore}
                                    </Typography>
                                    <Typography noWrap fontSize={"20px"} color={theme.palette.text.primary} sx={{ minWidth: 0 }}>
                                        {leftTeamName}
                                    </Typography>
                                </Stack>
                                <Box
                                    sx={{
                                        pt: 0,
                                        px: 0.8,
                                        borderRadius: "5px",
                                        backgroundColor: theme.palette.text.secondary,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}
                                >
                                    <Typography color={theme.palette.background.default} fontSize={"10px"}
                                                fontWeight={"600"}>
                                        VS
                                    </Typography>
                                </Box>
                                <Stack
                                    direction={"row"}
                                    justifyContent={"end"}
                                    alignItems={"center"}
                                    spacing={2}
                                >
                                    <Typography noWrap fontSize={"20px"} color={theme.palette.text.primary} sx={{ minWidth: 0 }}>
                                        {rightTeamName}
                                    </Typography>
                                    <Typography sx={{color: theme.palette.text.primary, fontSize: "20px", fontWeight: "bold"}}>
                                        {rightScore}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                        <Stack>
                            <Button
                                color={"secondary"}
                                sx={{
                                    width: "100%",
                                    border: `1px solid ${theme.palette.secondary.dark}66`,
                                }}
                            >
                                <Stack
                                    direction={"column"}
                                    justifyContent={"space-between"}
                                    alignItems={"space-between"}
                                    maxWidth={'xl'}
                                    mr={0.5}
                                    sx={{ flexGrow:1 }}
                                    spacing={0}
                                >
                                    <Box>
                                        <ThemeProvider theme={{direction:"rtl"}}>
                                            <PointBar
                                                variant={"determinate"}
                                                value={leftScore * barOffset}
                                            />
                                        </ThemeProvider>
                                    </Box>
                                </Stack>
                                <Stack
                                    direction={"column"}
                                    justifyContent={"space-between"}
                                    alignItems={"space-between"}
                                    maxWidth={'xl'}
                                    ml={0.5}
                                    sx={{ flexGrow:1 }}
                                    spacing={0}
                                >
                                    <Box>
                                        <PointBar
                                            variant={"determinate"}
                                            value={rightScore * barOffset}
                                        />
                                    </Box>
                                </Stack>
                            </Button>
                        </Stack>
                        <Box sx={{overflow: "auto", pt: 1}}>
                            <Stack sx={{width: "100%"}} direction={"row"} spacing={0.2} pl={0}>
                                <Chip
                                    label={`審判：${judgeTeamName}`}
                                    avatar={<Avatar><HiFlag/></Avatar>}
                                    color={"secondary"}
                                />
                                <Chip
                                    label={`開始：${formattedTime}`}
                                    avatar={<Avatar><HiClock/></Avatar>}
                                    color={"secondary"}
                                />
                                <Chip
                                    label={`場所：${locationName ?? "未登録"}`}
                                    avatar={<Avatar><HiMapPin/></Avatar>}
                                    color={"secondary"}
                                />
                            </Stack>
                        </Box>
                    </Card>

                    <Typography
                        noWrap
                        color={theme.palette.text.primary}
                        textAlign={"center"}
                        pt={2}
                    >
                        {leftTeamName}のメンバー
                    </Typography>
                    {users
                        .filter(user => user.teams.some(t => t.id === leftTeamId))
                        .map(user => {
                            return (
                                <Fragment key={user.id}>
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
                                                {user.name}
                                            </Typography>
                                        </Stack>
                                    </Card>
                                </Fragment>
                            );
                        })}
                    <Typography
                        noWrap
                        color={theme.palette.text.primary}
                        textAlign={"center"}
                        pt={2}
                    >
                        {rightTeamName}のメンバー
                    </Typography>
                    {users
                        .filter(user => user.teams.some(t => t.id === rightTeamId))
                        .map(user => {
                            return (
                                <Fragment key={user.id}>
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
                                                {user.name}
                                            </Typography>
                                        </Stack>
                                    </Card>
                                </Fragment>
                            );
                        })}
                    {props.dashboard &&
                        <Button
                            color={"secondary"}
                            sx={{background:theme.palette.secondary.dark}}
                            fullWidth disableElevation
                            variant={"contained"}
                            component={Link}
                            to={`/sports/${props.match.competition.sport.id}`}
                        >
                            <Stack
                                direction={"row"}
                                justifyContent={"flex-start"}
                                alignItems={"center"}
                                spacing={2}
                                py={0.5}
                                width={"100%"}
                            >
                                <Avatar
                                    sx={{
                                        height: "2em",
                                        width: "2em",
                                        backgroundColor: "inherit",
                                    }}
                                >
                                    <SvgIcon>
                                        <HiArrowRight color={`${theme.palette.text.primary}99`}/>
                                    </SvgIcon>
                                </Avatar>
                                <Typography sx={{color: theme.palette.text.primary, fontSize: "14px"}}>
                                    競技ページに行く
                                </Typography>
                            </Stack>
                        </Button>
                    }
                </Stack>
            </Container>
        </Box>
    )
}
