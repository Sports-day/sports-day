"use client";

import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";
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

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
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
