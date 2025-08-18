import { Toolbar, Box } from "@mui/material";
import Image from "next/image";

export default function Header() {
  return (
    <Box
      style={{
        background: "#3E4CB2",
        width: "100%",
        height: "10%",
        position: "relative",
      }}
    >
      <Toolbar
        style={{ justifyContent: "flex-start", width: "10%", height: "100%" }}
      >
        <Image src="/images/logo_form.png" alt="" width={400} height={20} />
      </Toolbar>
    </Box>
  );
}
