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

export default function CheckPopup({ teamid, open, setOpen }: CheckPopupProps) {
  const [DeleteTeam] = useMutation(DELETE_TEAM);

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

  const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
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
          onClick={() => {
            handleClose();
            handleDelete(teamid);
            window.location.reload();
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
