"use client";

import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";
import { useState } from "react";

type MembersCardProps = {
  studentid: string;
  addstudent?: (studentid: string) => void;
  fixed?: boolean;
};

export default function MembersCard({
  studentid,
  addstudent,
  fixed,
}: MembersCardProps) {
  const [clicked, setClicked] = useState(false);
  const handleClick = () => {
    if (fixed) {
      return;
    }
    if (!clicked) {
      setClicked(true);
    }
    if (addstudent) {
      addstudent(studentid);
    }
  };
  return (
    <CardActionArea onClick={handleClick}>
      <Card
        sx={{
          background: fixed ? "#6D7AE0" : clicked ? "#808080" : "#6D7AE0",
          borderRadius: "10px",
          textAlign: "center",
          color: "white",
          padding: "2vh",
          mt: "1%",
          mx: "1%",
        }}
      >
        <Typography>{studentid}</Typography>
      </Card>
    </CardActionArea>
  );
}
