import { Card, Box, Typography, Stack, Button, useTheme } from "@mui/material";
import { useState } from "react";
import CheckPopup from "../../popups/CheckPopup";
import { Link } from "react-router-dom";

type teamMember = {
  id: string;
  name: string;
  isExperienced: boolean;
};

type teamInformationProps = {
  teamid: string;
  teamname: string;
  type: string;
  sports: string;
  member: teamMember[];
};

export default function TeamCard({
  teamid,
  teamname,
  type,
  sports,
  member,
}: teamInformationProps) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const theme = useTheme();
  return (
    <Card
      variant="outlined"
      sx={{
        height: "clamp(260px, 40vw, 420px)",
        width: "100%",
        borderRadius: "10px",
        background: theme.palette.card.light,
        borderColor: theme.palette.card.main,
        borderWidth: "1px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ pb: "8px", px: "8px" }}>
        <Typography
          noWrap
          align="center"
          sx={(theme) => ({ ...theme.typography.buttonFont3, width: '100%' })}
        >
          {teamname}
        </Typography>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          px: "8px",
          pb: "8px",
        }}
      >
        <Stack spacing={"8px"}>
          {member.map((item) => (
            <Card
              key={item.id}
              sx={{
                background: theme.palette.card.main,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: "8px",
                borderRadius: "10px",
                position: "relative",
              }}
            >
              {item.isExperienced && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "#FF9800",
                  }}
                />
              )}
              <Typography noWrap sx={{ color: "white", minWidth: 0, width: '100%', textAlign: 'center' }}>{item.name}</Typography>
            </Card>
          ))}
        </Stack>
      </Box>

      <Box
        sx={{
          background: "none",
          p: "8px",
          width: "100%",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={"8px"}
          justifyContent="center"
          alignItems="center"
          sx={{
            width: "100%",
          }}
        >
          <Link
            to={`/weather/${type}/sport/${sports}/team/teamedit?teamid=${teamid}`}
            style={{ width: "100%" }}
          >
            <Button
              component="span"
              sx={{
                width: "100%",
                borderRadius: "10px",
                p: "4px",
                color: "#ffffff",
                background: theme.palette.button.main,
                "&:hover": {
                  width: "100%",
                  borderRadius: "10px",
                  p: "4px",
                  color: "#ffffff",
                  background: theme.palette.button.main,
                },
              }}
            >
              編集
            </Button>
          </Link>

          <Button
            variant="outlined"
            onClick={handleOpen}
            sx={{
              borderWidth: "2px",
              borderColor: "#E4781A",
              background: "white",
              color: "#E4781A",
              borderRadius: "10px",
              p: "4px",
              width: "100%",
              "&:hover": {
                borderWidth: "2px",
                borderColor: "#E4781A",
                background: "white",
                color: "#E4781A",
                borderRadius: "10px",
                p: "4px",
                width: "100%",
                opacity: 0.8,
              },
            }}
          >
            削除
          </Button>

          <CheckPopup teamid={teamid} open={open} setOpen={setOpen} />
        </Stack>
      </Box>
    </Card>
  );
}
