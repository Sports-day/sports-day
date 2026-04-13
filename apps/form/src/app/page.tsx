import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CircularUnderLoad from "@/features/Loading";
import { useGetTypeQuery } from "@/gql/__generated__/graphql";

export default function Home() {
  const { data, error } = useGetTypeQuery({
    fetchPolicy: "cache-and-network",
  });
  const navigate = useNavigate();

  const firstSceneId = data?.scenes?.filter((s) => !s.isDeleted)?.[0]?.id;

  useEffect(() => {
    if (firstSceneId) {
      navigate(`/weather/${firstSceneId}`, { replace: true });
    }
  }, [firstSceneId, navigate]);

  if (error) {
    throw error;
  }

  return <CircularUnderLoad />;
}
