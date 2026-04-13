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
}

export const ScheduleContent = (props: ScheduleContentProps) => {
    const theme = useTheme();
    const [open, toggleDrawer] = React.useState(false);

    const isAttending = props.match.judgment?.isAttending ?? false;
    const isFinished = props.match.status === "FINISHED";
    const isCanceled = props.match.status === "CANCELED";

    const leftEntry = props.match.entries[0];
    const rightEntry = props.match.entries[1];
    const leftTeamName = leftEntry?.team?.name ?? null;
    const rightTeamName = rightEntry?.team?.name ?? null;

    //  team is null
    if (!leftTeamName || !rightTeamName) return null;

    //  time and location from match
    const formattedTime = new Date(props.match.time).toLocaleTimeString("ja-JP", {
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <>
            {isAttending && !isFinished && !isCanceled && (
                <Stack sx={{ width: "100%", justifyContent: "center", alignItems: "start" }}>
                    <Box
                        sx={{
                            py: 0.25,
                            px: 2,
                            borderRadius: "9px",
                            backgroundColor: `#1565c066`,
                            position: "relative",
                            top: "4px",
                        }}
                    >
                        <Typography color={theme.palette.text.primary} fontSize="10px" fontWeight="600">
                            出席済み
                        </Typography>
                    </Box>
                </Stack>
            )}
            {isFinished && (
                <Stack sx={{ width: "100%", justifyContent: "center", alignItems: "start" }}>
                    <Box
                        sx={{
                            py: 0.25,
                            px: 2,
                            borderRadius: "9px",
                            backgroundColor: `#7b1fa266`,
                            position: "relative",
                            top: "4px",
                        }}
                    >
                        <Typography color={theme.palette.text.primary} fontSize="10px" fontWeight="600">
                            スコア提出済み
                        </Typography>
                    </Box>
                </Stack>
            )}
            <Button
                variant={"contained"}
                color={"secondary"}
                onClick={() => toggleDrawer(true)}
                sx={{
                    width: "100%",
                    border: `1px solid ${isFinished ? '#7b1fa266' : isAttending ? '#1565c066' : `${theme.palette.secondary.dark}66`}`,
                }}
            >
                <Stack
                    direction={"row"}
                    spacing={1}
                    sx={{width: "100%", height: "100%"}}
                    alignItems={"flex-start"}
                    justifyContent={"center"}
                >

                    <Stack
                        direction={"column"}
                        spacing={1}
                        justifyContent={"center"}
                        alignItems={"start"}
                        sx={{height: "60px", flexGrow:1}}
                    >
                        <Stack
                            direction={"row"}
                            spacing={1}
                            alignItems={"center"}
                        >
                            <Typography fontSize={"14px"} color={theme.palette.text.primary}>
                                {rightTeamName}
                            </Typography>
                            <Box
                                sx={{
                                    px: 0.8,
                                    height:"16px",
                                    borderRadius: "5px",
                                    backgroundColor: theme.palette.text.secondary,
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >
                                <Typography color={theme.palette.background.default} fontSize={"10px"} fontWeight={"600"}>
                                    VS
                                </Typography>
                            </Box>
                        </Stack>
                        <Typography fontSize={"14px"} color={theme.palette.text.primary}>
                            {leftTeamName}
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
                            <Typography sx={{color: theme.palette.text.primary, fontSize: "14px"}}>
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
