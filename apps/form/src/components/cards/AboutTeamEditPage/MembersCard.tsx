"use client";

import {
  Box,
  Card,
  CardActionArea,
  Typography,
  Button,
  Tooltip,
  useTheme,
} from "@mui/material";
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
            minHeight: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "white",
            p: "8px",
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <Typography
            sx={(theme) => ({
              ...theme.typography.buttonFont1,
              flexGrow: 1,
              minWidth: 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            })}
          >
            {studentname}
          </Typography>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              remove && remove();
            }}
            sx={{ ml: "8px", minWidth: 28, p: "4px" }}
          >
            <Typography sx={{ color: "white", fontSize: "20px", lineHeight: 1 }}>
              ×
            </Typography>
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
          minHeight: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          p: "8px",
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            color: "white",
            position: "absolute",
            left: 11,
            width: 16,
            height: 16,
            borderRadius: "50%",
            border: "1.5px solid #fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px",
            lineHeight: 1,
          }}
        >
          /
        </Box>
        <Typography
          sx={(theme) => ({
            ...theme.typography.buttonFont1,
            minWidth: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          })}
        >
          {studentname}
        </Typography>
      </Card>
    );
  }

  if (isInclude && !disable) {
    return (
      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 1 }} style={{ width: "100%" }}>
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
                minHeight: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                p: "8px",
                minWidth: 0,
                overflow: "hidden",
              }}
            >
              <Typography
                sx={(theme) => ({
                  ...theme.typography.buttonFont1,
                  minWidth: 0,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
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
    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 1 }} style={{ width: "100%" }}>
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
            minHeight: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            p: "8px",
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <Typography
            sx={(theme) => ({
              ...theme.typography.buttonFont1,
              minWidth: 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            })}
          >
            {studentname}
          </Typography>
        </Card>
      </CardActionArea>
    </motion.div>
  );
}
