import { Link } from "react-router-dom";
import { Typography, useTheme, Button } from "@mui/material";

type Props = {
  type: string;
  sports: string;
  teams: string;
};

export default function EditButton({ type, sports, teams }: Props) {
  const theme = useTheme();
  return (
    <Link to={`/weather/${type}/sport/${sports}/team/teamedit?teamid=${teams}`}>
      <Button
        variant="outlined"
        component="span"
        sx={{
          borderColor: theme.palette.button.main,
          borderWidth: "2px",
          borderRadius: "10px",
          p: "4px",
          width: "100%",
          background: theme.palette.button.main,
          "&:hover": {
            borderColor: theme.palette.button.main,
            borderWidth: "2px",
            borderRadius: "10px",
            p: "4px",
            width: "100%",
            background: theme.palette.button.main,
            opacity: 0.8,
          },
        }}
      >
        <Typography
          sx={(theme) => ({
            ...theme.typography.buttonFont1,
          })}
        >
          編集
        </Typography>
      </Button>
    </Link>
  );
}
