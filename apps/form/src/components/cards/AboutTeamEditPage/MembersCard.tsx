"use client";

import {
  Box,
  Card,
  CardActionArea,
  Chip,
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
  isExperienced?: boolean;
  onToggleExperience?: () => void;
  experienceDisabled?: boolean;
};

export default function MembersCard({
  studentid,
  studentname,
  addstudent,
  fixed,
  isInclude,
  remove,
  disable,
  isExperienced,
  onToggleExperience,
  experienceDisabled,
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

          {onToggleExperience && (
            <Chip
              label="経験者"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                if (!experienceDisabled || isExperienced) onToggleExperience();
              }}
              sx={{
                ml: "4px",
                flexShrink: 0,
                height: 24,
                fontSize: "11px",
                fontWeight: 600,
                cursor: experienceDisabled && !isExperienced ? "default" : "pointer",
                transition: "all 0.15s",
                ...(isExperienced
                  ? {
                      backgroundColor: "#FF9800",
                      color: "#fff",
                      border: "1px solid #FF9800",
                      "&:hover": { backgroundColor: "#F57C00" },
                    }
                  : {
                      backgroundColor: "transparent",
                      color: "rgba(255,255,255,0.6)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      opacity: experienceDisabled ? 0.4 : 1,
                      "&:hover": experienceDisabled
                        ? {}
                        : { borderColor: "rgba(255,255,255,0.6)" },
                    }),
              }}
            />
          )}

          <Button
            onClick={(e) => {
              e.stopPropagation();
              remove && remove();
            }}
            sx={{ minWidth: 28, p: "4px", flexShrink: 0 }}
          >
            <Typography sx={{ color: "white", fontSize: "20px", lineHeight: 1 }}>
              ×
            </Typography>
          </Button>
        </Card>
      </motion.div>
    );
  }

  if (isInclude && disable) {
    return (
      <Tooltip
        title="このシーンの別チームに所属済みのため選択できません"
        disableInteractive
        placement="right-end"
      >
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
      </Tooltip>
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
