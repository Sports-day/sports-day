import {Stack, Typography} from "@mui/material";
import Userinfo from "@/components/Userinfo";

export default function Home() {
    return (
        <Stack height="100lvh" justifyContent="center" alignItems="center" gap="32px">
            <Typography variant="h3">Home</Typography>

            <Userinfo />
        </Stack>
    );
}
