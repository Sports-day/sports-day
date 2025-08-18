"use client";

import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CircularUnderLoad from "@/features/loading";

const GET_TYPE = gql`
  query GetType {
    scenes {
      id
    }
  }
`;

export default function Home() {
  const { data, loading } = useQuery(GET_TYPE);
  const router = useRouter();

  useEffect(() => {
    if (!loading && data?.scenes?.[0]?.id) {
      const id = data.scenes[0].id;
      router.push(`/weather/${id}`);
    }
  }, [loading, data, router]);

  return <CircularUnderLoad />;
}
