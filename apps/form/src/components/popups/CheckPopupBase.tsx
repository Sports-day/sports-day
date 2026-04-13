"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Slide,
  Alert,
} from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";
import { forwardRef, useState } from "react";
import type { ReactElement } from "react";
import { useDeleteTeamFromPopupMutation } from "@/gql/__generated__/graphql";

export type CheckPopupBaseProps = {
  teamid: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  refetchQueries: string[];
};

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement<any, any>;
  },
  ref,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CheckPopupBase({
  teamid,
  open,
  setOpen,
  refetchQueries,
}: CheckPopupBaseProps) {
  const [deleteTeam] = useDeleteTeamFromPopupMutation({
    refetchQueries,
  });
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleClose = () => {
    setDeleteError(null);
    setOpen(false);
  };

  const handleDelete = async (dteam: string) => {
    setDeleteError(null);
    try {
      await deleteTeam({
        variables: {
          deleteTeamId: dteam,
        },
      });
      handleClose();
    } catch {
      setDeleteError("チーム削除に失敗しました。もう一度お試しください。");
    }
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
          maxHeight: deleteError ? 260 : 200,
          p: "16px",
        },
      }}
    >
      <DialogTitle>チーム削除の確認</DialogTitle>
      <DialogContent>
        <Typography>本当に削除しますか?</Typography>
        {deleteError && (
          <Alert severity="error" sx={{ mt: "8px" }}>
            {deleteError}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <Button
          onClick={() => handleDelete(teamid)}
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
