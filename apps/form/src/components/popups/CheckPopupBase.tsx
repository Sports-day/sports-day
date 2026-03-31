"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Slide,
} from "@mui/material";
import { gql, useMutation } from "@apollo/client";
import type { TransitionProps } from "@mui/material/transitions";
import { forwardRef } from "react";
import type { ReactElement, Ref } from "react";

export type CheckPopupBaseProps = {
  teamid: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  refetchQueries: string[];
};

const DELETE_TEAM = gql`
  mutation DeleteTeam($deleteTeamId: ID!) {
    deleteTeam(id: $deleteTeamId)
  }
`;

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement<any, any>;
  },
  ref: Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CheckPopupBase({
  teamid,
  open,
  setOpen,
  refetchQueries,
}: CheckPopupBaseProps) {
  const [deleteTeam] = useMutation(DELETE_TEAM, {
    refetchQueries,
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async (dteam: string) => {
    await deleteTeam({
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
      transitionDuration={250}
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
      <DialogActions sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <Button
          onClick={async () => {
            await handleDelete(teamid);
            handleClose();
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
