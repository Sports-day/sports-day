import TeamEdit from "@/features/TeamEdit";
import SubFooter from "@/components/footers/SubFooter";
import Header from "@/components/header/Header";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useParams } from "react-router-dom";
import Instruction from "@/components/cards/AboutAnyPage/InstructionCard";
import AppBreadcrumbs, {
  type BreadcrumbItem,
} from "@/components/layouts/AppBreadcrumbs";
import CircularUnderLoad from "@/features/Loading";
import { useSportDataGetQuery } from "@/gql/__generated__/graphql";

export default function MemberEdit() {
  const { type, sports } = useParams() as { type: string; sports: string };
  const { data, loading, error } = useSportDataGetQuery({
    variables: { sport_Id: sports, scene_Id: type },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
  });

  if (loading) {
    return <CircularUnderLoad />;
  }
  if (error) {
    throw error;
  }

  const weatherName = data?.scene?.name;
  const sportName = data?.sport?.name;
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "ホーム", href: `/weather/${type}` },
    { label: "チーム確認", href: `/weather/${type}/sport/${sports}` },
    { label: "チーム編集" },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />
      <Box
        sx={{
          height: {
            xs: "calc(100dvh - 64px - 72px)",
            md: "calc(100dvh - 72px - 72px)",
          },
          px: "50px",
          pt: "16px",
          width: "100%",
          minHeight: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ mb: "8px", flexShrink: 0 }}>
          <AppBreadcrumbs items={breadcrumbs} />
        </Box>
        <Stack
          direction="row"
          display="flex"
          justifyContent="left"
          sx={{ mb: "8px", flexShrink: 0 }}
        >
          <Instruction weather={weatherName} sportname={sportName} />
        </Stack>
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <TeamEdit />
        </Box>
      </Box>
      <SubFooter />
    </Box>
  );
}
