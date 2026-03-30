"use client";

import {
  Box,
  Card,
  TextField,
  Stack,
  Button,
  Typography,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { motion } from "framer-motion";
import MembersCard from "@/components/cards/AboutTeamEditPage/MembersCard";
import { useTeamEdit } from "@/features/hooks/useTeamEdit";
import CircularUnderLoad from "@/features/Loading";

export default function TeamEdit() {
  const theme = useTheme();
  const {
    loading,
    selectedMember,
    selectedIds,
    searchName,
    setSearchName,
    filteredUsers,
    alreadyInAnyTeam,
    addSelectedMember,
    removeStudent,
    submit,
    isSubmitting,
  } = useTeamEdit();

  if (loading) {
    return <CircularUnderLoad />;
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        flex: 1,
        minHeight: 0,
        background: theme.palette.card.light,
        borderRadius: "10px",
        display: "flex",
        px: "32px",
        pt: "16px",
        pb: "32px",
        overflow: { xs: "auto", md: "hidden" },
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            md: "320px minmax(0, 1fr)",
          },
          gap: "16px",
          height: { xs: "auto", md: "100%" },
          minHeight: 0,
          alignItems: "stretch",
        }}
      >
        <Box
          sx={{
            height: { xs: "auto", md: "100%" },
            display: "flex",
            minHeight: 0,
            minWidth: 0,
          }}
        >
          <Stack
            sx={{ width: "100%", height: "100%", minHeight: 0, minWidth: 0 }}
          >
            <Typography
              sx={(theme) => ({
                ...theme.typography.buttonFont2,
              })}
            >
              メンバーを選択してください
            </Typography>
            <Card
              variant="outlined"
              sx={{
                borderColor: theme.palette.card.main,
                borderWidth: "1px",
                borderStyle: "solid",
                borderRadius: "10px",
                width: "100%",
                background: "none",
                display: "flex",
                flexDirection: "column",
                flex: 1,
                minHeight: 0,
                overflow: "hidden",
              }}
            >
              <Stack
                direction="column"
                flexWrap="nowrap"
                sx={{
                  flexGrow: 1,
                  overflowY: "scroll",
                  overflowX: "hidden",
                  scrollbarGutter: "stable",
                  minHeight: 0,
                }}
              >
                {selectedMember?.length === 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      width: "100%",
                      p: "16px",
                    }}
                  >
                    <Typography sx={{ color: "#FF0000" }}>
                      ※学籍番号をタッチして
                      <br />
                      メンバーを追加してください
                    </Typography>
                  </Box>
                ) : (
                  selectedMember.map((student, index) => (
                    <Box key={index} sx={{ p: "8px" }}>
                      <MembersCard
                        studentname={student.studentName}
                        fixed={true}
                        remove={() => {
                          removeStudent(student.studentId);
                        }}
                      />
                    </Box>
                  ))
                )}
              </Stack>
              <Box
                sx={{
                  background: theme.palette.card.main,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    sx={{
                      background: theme.palette.button.light,
                      color: "white",
                      width: "60%",
                      my: "8px",
                      "&:hover": {
                        opacity: 0.8,
                        background: theme.palette.button.light,
                        color: "white",
                      },
                      "&:disabled": {
                        background: theme.palette.button.light,
                        color: "white",
                        opacity: 0.5,
                      },
                    }}
                    disabled={selectedMember.length === 0 || isSubmitting}
                    variant="contained"
                    onClick={submit}
                  >
                    {isSubmitting ? "登録中..." : "登録"}
                  </Button>
                </motion.div>
              </Box>
            </Card>
          </Stack>
        </Box>

        <Box
          sx={{
            height: { xs: "auto", md: "100%" },
            display: "flex",
            minHeight: 0,
            minWidth: 0,
          }}
        >
          <Stack
            sx={{ width: "100%", height: "100%", minHeight: 0, minWidth: 0 }}
          >
            <Typography
              sx={(theme) => ({
                ...theme.typography.buttonFont2,
              })}
            >
              メンバー一覧
            </Typography>
            <Card
              variant="outlined"
              sx={{
                borderColor: theme.palette.card.main,
                borderWidth: "1px",
                borderStyle: "solid",
                borderRadius: "10px",
                width: "100%",
                background: "none",
                display: "flex",
                flexDirection: "column",
                flex: 1,
                minHeight: 0,
                minWidth: 0,
                overflow: "hidden",
              }}
            >
              <Stack
                sx={{
                  width: "100%",
                  height: "100%",
                  px: "32px",
                  pt: "16px",
                  minHeight: 0,
                }}
              >
                <TextField
                  id="outlined-basic"
                  placeholder="検索"
                  variant="outlined"
                  fullWidth
                  slotProps={{
                    inputLabel: { shrink: true },
                  }}
                  sx={{
                    borderColor: theme.palette.card.main,
                    background: theme.palette.card.light,
                    color: "#808080",
                    borderRadius: "10px",
                    width: "100%",
                    mb: "16px",
                  }}
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
                <Box
                  sx={{
                    flex: 1,
                    overflowY: "scroll",
                    scrollbarGutter: "stable",
                    minHeight: 0,
                    pb: "8px",
                    pr: "8px",
                  }}
                >
                  <Grid container spacing={"8px"}>
                    {filteredUsers?.map((item, index) => (
                      <Grid
                        key={item.id}
                        size={{ xs: 6, sm: 4, md: 4, lg: 3, xl: 2 }}
                        sx={{ display: "flex", minWidth: 0 }}
                      >
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: 0.7,
                            delay: index * 0.01,
                          }}
                          style={{ width: "100%", height: "100%" }}
                        >
                          <MembersCard
                            studentid={item.id}
                            studentname={item.name}
                            addstudent={() =>
                              addSelectedMember({
                                studentId: String(item.id),
                                studentName: item.name,
                              })
                            }
                            disable={selectedIds.includes(String(item.id))}
                            isInclude={
                              alreadyInAnyTeam.some(
                                (a) => a.id === String(item.id),
                              ) || selectedIds.includes(String(item.id))
                            }
                            remove={() => removeStudent(String(item.id))}
                          />
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Stack>
            </Card>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
