"use client";

import {
  Card,
  CardActionArea,
  Typography,
  Button,
  Tooltip,
  useTheme,
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import BlockIcon from "@mui/icons-material/Block";
import { motion } from "framer-motion";

type MembersCardProps = {
  studentid?: string;
  studentname?: string;
  addstudent?: (studentid: string) => void;
  fixed?: boolean;
  isInclude?: boolean;
  remove?: () => void;
  disable?: boolean;
};

export default function MembersCard({
  studentid,
  studentname,
  addstudent,
  fixed,
  isInclude,
  remove,
  disable,
}: MembersCardProps) {
  const theme = useTheme();
  const handleClick = () => {
    if (fixed) {
      return;
    }

    if (addstudent && studentid) {
      addstudent(studentid);
    }
  };

  if (fixed) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Card
          sx={{
            background: theme.palette.card.main,
            borderRadius: "10px",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "white",
            p: "8px",
          }}
        >
          <Typography
            sx={(theme) => ({
              ...theme.typography.bottonFont1,
            })}
          >
            {studentname}
          </Typography>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              remove && remove();
            }}
          >
            <CancelOutlinedIcon sx={{ color: "white" }} />
          </Button>
        </Card>
      </motion.div>
    );
  }

  if (disable) {
    return (
      <Card
        sx={{
          background: "#808080",
          borderRadius: "10px",
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          p: "8px",
        }}
      >
        <BlockIcon sx={{ color: "white", position: "absolute", left: 11 }} />
        <Typography
          sx={(theme) => ({
            ...theme.typography.bottonFont1,
          })}
        >
          {studentname}
        </Typography>
      </Card>
    );
  }

  if (isInclude && !disable) {
    return (
      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 1 }}>
        <CardActionArea
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          <Tooltip
            title={
              <>
                <div>すでに他のチームに所属しています。</div>
                <br />
                <div>こちらのチームに追加することが可能です。</div>
              </>
            }
            disableInteractive
            placement="right-end"
          >
            <Card
              sx={{
                background: "#808080",
                borderRadius: "10px",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                p: "8px",
              }}
            >
              <Typography
                sx={(theme) => ({
                  ...theme.typography.bottonFont1,
                })}
              >
                {studentname}
              </Typography>
            </Card>
          </Tooltip>
        </CardActionArea>
      </motion.div>
    );
  }

  return (
    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 1 }}>
      <CardActionArea
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
      >
        <Card
          sx={{
            background: theme.palette.card.main,
            borderRadius: "10px",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            p: "8px",
          }}
        >
          <Typography
            sx={(theme) => ({
              ...theme.typography.bottonFont1,
            })}
          >
            {studentname}
          </Typography>
        </Card>
      </CardActionArea>
    </motion.div>
  );
}
