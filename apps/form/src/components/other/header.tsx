import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Image from "next/image";

export default function Header() {
  return (
    <Box style={{ background: "#5F6DC2" }}>
      <Toolbar
        style={{ justifyContent: "flex-start", width: "1vh", height: "1vh" }}
      >
        <Image src="/images/logo_form.png" alt="" width={200} height={10} />
      </Toolbar>
    </Box>
  );
}
