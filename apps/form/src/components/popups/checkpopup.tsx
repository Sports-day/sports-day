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

export default function CheckPopup({ teamid, open, setOpen }: CheckPopupProps) {
  const [DeleteTeam] = useMutation(DELETE_TEAM, {
    refetchQueries: ["GetSceneSport"],
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
        },
      }}
    >
      <DialogTitle>チーム削除の確認</DialogTitle>
      <DialogContent>
        <Typography>本当に削除しますか?</Typography>
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          onClick={async () => {
            handleClose();
            await handleDelete(teamid);
          }}
        >
          削除
        </Button>
        <Button variant="contained" onClick={handleClose}>
          キャンセル
        </Button>
      </DialogActions>
    </Dialog>
  );
}
