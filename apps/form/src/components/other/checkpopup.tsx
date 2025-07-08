import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import DialogActions from "@mui/material/DialogActions";

type CheckPopupProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  Delete: () => void;
};

export default function CheckPopup({ open, setOpen, Delete }: CheckPopupProps) {
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>チーム削除の確認</DialogTitle>
      <DialogContent>
        <Typography>本当に削除しますか?</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            Delete();
            handleClose();
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
