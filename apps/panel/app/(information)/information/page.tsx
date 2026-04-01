import {Box, LinearProgress, Stack, Typography} from "@mui/material";
import SportsList from "@/components/sports/sportsList";
import InfoCircleContainer from "@/components/information/layout/infoCircleContainer";
import {useFetchSports} from "@/src/features/sports/hook";

export default function Page() {
    const {sports, isFetching} = useFetchSports()

    return (
        <>
            <Box
                component="main"
                sx={{
                    width: '100vw',
                    overflowX: 'hidden',
                }}
            >
                <InfoCircleContainer/>

                {isFetching ? (
                    <LinearProgress />
                ) : (
                    <Stack spacing={15}>
                        <Typography variant="h4" fontWeight={"600"} align={"center"}>
                            競技を選ぶ
                        </Typography>
                        <SportsList sports={sports}/>
                    </Stack>
                )}
            </Box>
        </>
    )
}
