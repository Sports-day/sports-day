import Button from "@mui/material/Button";
import Link from "next/link";

export default function GoFinal() {
  return (
    <Link href={{ pathname: "/confirm/finalconfirm" }} passHref>
      <Button component="span" sx={{ color: "#5B6DC6", background: "white" }}>
        確認画面に進む
      </Button>
    </Link>
  );
}
