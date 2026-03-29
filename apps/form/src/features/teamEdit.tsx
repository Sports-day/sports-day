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
        px: { xs: "16px", md: "32px" },
        py: { xs: "8px", md: "16px" },
        overflow: { xs: "auto", md: "hidden" },
      }}
    >
      <Grid
        container
        spacing={"16px"}
        sx={{ height: { xs: "auto", md: "100%" }, minHeight: 0 }}
      >
        <Grid
          size={{ xs: 12, md: 4, lg: 3, xl: 3 }}
          sx={{
            height: { xs: "auto", md: "100%" },
            display: "flex",
            minHeight: 0,
          }}
        >
          <Stack sx={{ width: "100%", height: "100%", minHeight: 0 }}>
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
                  overflowY: "auto",
                  overflowX: "hidden",
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
        </Grid>

        <Grid
          size={{ xs: 12, md: 8, lg: 9 }}
          sx={{
            height: { xs: "auto", md: "100%" },
            display: "flex",
            minHeight: 0,
          }}
        >
          <Stack sx={{ width: "100%", height: "100%", minHeight: 0 }}>
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
                overflow: "hidden",
              }}
            >
              <Stack
                sx={{
                  width: "100%",
                  height: "100%",
                  px: { xs: "8px", md: "32px" },
                  pt: "16px",
                  minHeight: 0,
                }}
              >
                <TextField
                  id="outlined-basic"
                  label="...検索"
                  variant="outlined"
                  sx={{
                    borderColor: theme.palette.card.main,
                    background: theme.palette.card.light,
                    color: "#808080",
                    borderRadius: "10px",
                    mb: "16px",
                  }}
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
                <Box sx={{ flex: 1, overflowY: "auto", minHeight: 0, pb: "8px" }}>
                  <Grid container spacing={"16px"}>
                    {filteredUsers?.map((item, index) => (
                      <Grid
                        key={item.id}
                        size={{ xs: 6, sm: 4, md: 3, lg: 3, xl: 3 }}
                      >
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: 0.7,
                            delay: index * 0.02,
                          }}
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
                              alreadyInAnyTeam.some((a) => a.id === String(item.id)) ||
                              selectedIds.includes(String(item.id))
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
        </Grid>
      </Grid>
    </Box>
  );
}
