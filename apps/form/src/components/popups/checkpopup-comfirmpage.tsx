"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { gql, useMutation } from "@apollo/client";

type CheckPopupProps = {
  teamid: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DELETE_TEAM = gql`
  mutation DeleteTeam($deleteTeamId: ID!) {
    deleteTeam(id: $deleteTeamId)
  }
`;

export default function CheckPopup_Confirm({
  teamid,
  open,
  setOpen,
}: CheckPopupProps) {
  const [DeleteTeam] = useMutation(DELETE_TEAM, {
    refetchQueries: ["GetAllTeamdata"],
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async (dteam: string) => {
    await DeleteTeam({
      variables: {
        deleteTeamId: dteam,
      },
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "10px",
          width: "100%",
          height: "100%",
          maxWidth: 400,
          maxHeight: 200,
          p: "16px",
        },
      }}
    >
      <DialogTitle>チーム削除の確認</DialogTitle>
      <DialogContent>
        <Typography>本当に削除しますか?</Typography>
      </DialogContent>
      <DialogActions
        sx={{ display: "flex", justifyContent: "center", width: "100%" }}
      >
        <Button
          onClick={async () => {
            handleClose();
            await handleDelete(teamid);
          }}
          sx={{
            width: "100%",
            p: "4px",
            borderRadius: "10px",
            background: "#E4781A",
            color: "#ffffff",
            "&:hover": {
              background: "#E4781A",
              color: "#ffffff",
              borderRadius: "10px",
              opacity: 0.8,
            },
          }}
        >
          削除
        </Button>
        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{
            width: "100%",
            p: "4px",
            borderRadius: "10px",
            borderColor: "#D9D9D9",
            color: "#000000",
            "&:hover": {
              borderColor: "#D9D9D9",
              color: "#000000",
              borderRadius: "10px",
              opacity: 0.8,
            },
          }}
        >
          キャンセル
        </Button>
      </DialogActions>
    </Dialog>
  );
}
