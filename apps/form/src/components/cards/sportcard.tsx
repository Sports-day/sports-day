"use client";

import { information } from "@/Data/SunnyData";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Link from "next/link";
import Image from "next/image";

type informationProps = information & { type: string };

export default function SportCard({
  icon,
  name,
  sportid,
  type,
}: informationProps) {
  return (
    <Link href={`/weather/${type}/sport/${sportid}/teams`} passHref>
      <Card
        style={{
          background: "#5F6DC2",
          height: "20vh",
          borderRadius: "20px",
        }}
        component="div"
      >
        <CardActionArea>
          <Stack
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "20vh",
            }}
          >
            <Image src={icon} alt="" width={50} height={50} />
            <Typography color="white">{name}</Typography>
          </Stack>
        </CardActionArea>
      </Card>
    </Link>
  );
}
