import Link from "next/link";
import Button from "@mui/material/Button";

export default function SubmitButton() {
  return (
    <Link href={{ pathname: "confirm/finalconfirm" }} passHref>
      <Button sx={{ color: "#5B6DC6", background: "white" }}>提出</Button>
    </Link>
  );
}
