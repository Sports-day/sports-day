import Widerlogo from "@/src/assets/widerlogotype.svg?react";
import {useTheme} from "@mui/material/styles";

export default function WiderLogo() {
    const theme = useTheme();
    return (
        <Widerlogo width={80*1.5} height={13*1.5} fill={theme.palette.text.disabled}/>
    )
}