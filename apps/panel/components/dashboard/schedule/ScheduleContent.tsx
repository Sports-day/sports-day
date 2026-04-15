import {
    Box,
    Button,
    Stack,
    SvgIcon,
    SwipeableDrawer,
    Typography,
} from "@mui/material";
import * as React from "react";
import type { GetPanelMatchesQuery } from "@/src/gql/__generated__/graphql";
import {
    HiClock,
    HiMapPin,
} from "react-icons/hi2";
import {useTheme} from "@mui/material/styles";
import {MatchDetail} from "@/components/game/GameList/matchDetail";

type PanelMatch = GetPanelMatchesQuery["matches"][number];

export type ScheduleContentProps = {
    match: PanelMatch;
    myTeamId: string;
}

export const ScheduleContent = (props: ScheduleContentProps) => {
    const theme = useTheme();
    const [open, toggleDrawer] = React.useState(false);

    const leftEntry = props.match.entries[0];
    const rightEntry = props.match.entries[1];
    const leftTeamId = leftEntry?.team?.id ?? null;
    const rightTeamId = rightEntry?.team?.id ?? null;

    //  team is null
    if (!leftTeamId || !rightTeamId) return null;
    //  get opponent team name
    const opponentName = leftTeamId === props.myTeamId
        ? rightEntry?.team?.name
        : leftEntry?.team?.name;
    //  time and location from match
    const formattedTime = new Date(props.match.time).toLocaleTimeString("ja-JP", {
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <>
            <Button
                variant={"contained"}
                color={"secondary"}
                sx={{
                    width: "100%",
                    border: `1px solid ${theme.palette.secondary.dark}66`,
                }}
                onClick={() => toggleDrawer(true)}
            >
                <Stack
                    direction={"row"}
                    spacing={1}
                    sx={{width: "100%", height: "100%"}}
                    alignItems={"flex-start"}
                    justifyContent={"center"}
                >
                    <Stack
                        direction={"row"}
                        spacing={1}
                        justifyContent={"flex-start"}
                        alignItems={"center"}
                        sx={{height: "60px", flexGrow: 1, minWidth: 0, overflow: 'hidden'}}
                    >
                        <Box
                            sx={{
                                py: 0,
                                px: 0.8,
                                borderRadius: "5px",
                                backgroundColor: theme.palette.text.secondary,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexShrink: 0,
                            }}
                        >
                            <Typography color={theme.palette.background.default} fontSize={"10px"} fontWeight={"600"}>
                                VS
                            </Typography>
                        </Box>
                        <Typography noWrap fontSize={"20px"} color={theme.palette.text.primary} sx={{ minWidth: 0 }}>
                            {opponentName}
                        </Typography>
                    </Stack>

                    <Stack
                        direction={"column"}
                        justifyContent={"center"}
                        alignItems={"flex-start"}
                        pr={0.5}
                        py={0.5}
                        spacing={1}
                        sx={{height: "100%"}}
                    >
                        <Stack
                            direction={"row"}
                            alignItems={"flex-end"}
                            spacing={1}
                        >
                            <SvgIcon fontSize={"small"}>
                                <HiClock color={theme.palette.text.secondary}/>
                            </SvgIcon>
                            <Typography sx={{color: theme.palette.text.primary, fontSize: "14px"}}>
                                {formattedTime}
                            </Typography>
                        </Stack>
                        <Stack
                            direction={"row"}
                            alignItems={"flex-end"}
                            spacing={1}
                        >
                            <SvgIcon fontSize={"small"}>
                                <HiMapPin color={theme.palette.text.secondary}/>
                            </SvgIcon>
                            <Typography noWrap sx={{color: theme.palette.text.primary, fontSize: "14px", minWidth: 0}}>
                                {props.match.location?.name ?? "未登録"}
                            </Typography>
                        </Stack>
                    </Stack>
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
                <MatchDetail match={props.match} dashboard={true}/>
            </SwipeableDrawer>
        </>
    )
}
