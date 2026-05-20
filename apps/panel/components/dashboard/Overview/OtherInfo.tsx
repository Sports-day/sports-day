import {
    Stack,
    Typography,
    IconButton,
    useTheme,
    Button,
} from "@mui/material";
import {
    HiOutlineInformationCircle
} from "react-icons/hi"

export type OtherInfoProps = {
    infoName?: string;
    infoContent?: string;
    infoSubContent?: string;
    link?: string;
}

export const OtherInfo = (props: OtherInfoProps) => {
    const theme = useTheme()
    return (
        <Stack
            direction={"row"}
            justifyContent={"flex-start"}
            alignItems={"center"}
            spacing={3}
            px={2}
            pb={3}
            pt={2}
            mt={1}
            sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: "12px",
                height:"fit-content",
            }}
        >
            <IconButton
                sx={{backgroundColor: theme.palette.background.default}}
            >
                <HiOutlineInformationCircle color={theme.palette.text.primary}/>
            </IconButton>
            <Stack
                direction={"column"}
                justifyContent={"space-between"}
                alignItems={"flex-start"}
                spacing={1}
            >
                <Typography
                    color={theme.palette.text.primary}
                    sx={{fontSize: "12px"}}
                    lineHeight={"1.2em"}
                >
                    {props.infoName}
                </Typography>
                <Typography
                    color={theme.palette.text.primary}
                    sx={{fontSize: "14px", fontWeight: "bold"}}
                    lineHeight={"1.2em"}
                >
                    {props.infoContent}
                </Typography>
                {props.infoSubContent && (
                    <Typography
                        color={theme.palette.text.primary}
                        sx={{fontSize: "14px"}}
                        lineHeight={"1.2em"}
                    >
                        {props.infoSubContent}
                    </Typography>
                )}
                {props.link && (
                    <Button
                        component="a"
                        href={props.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                        variant="contained"
                        color="secondary"
                        disableElevation
                        sx={{
                            mt: 0.5,
                            border: `1px solid ${theme.palette.secondary.dark}66`,
                        }}
                    >
                        開く →
                    </Button>
                )}
            </Stack>
        </Stack>
    )
}