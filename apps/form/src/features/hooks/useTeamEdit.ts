"use client";

import { useMemo, useState } from "react";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ADD_TEAM_MEMBER,
  CREATE_SPORT_ENTRY,
  CREATE_TEAM,
  DELETE_MEMBER,
  DELETE_TEAM,
  GET_SPORTSCENE,
  GET_SPORTSCENE_ENTRIES,
  GET_TEAM,
  GET_USERS,
} from "@/features/teamEdit.gql";

export type StudentInformation = {
  studentId: string;
  studentName: string;
};

type UserNode = {
  id: string;
  name: string;
};

type TeamNode = {
  id: string;
  users: UserNode[];
};

type SportSceneNode = {
  id: string;
  sport: { id: string };
  scene: { id: string };
};

type SportSceneEntriesData = {
  sportScene: {
    id: string;
    entries: { team: TeamNode }[];
  } | null;
};

type SportSceneEntriesVars = {
  sportSceneId: string;
};

type GetUsersData = {
  users: UserNode[];
};

type GetSportSceneData = {
  sportScenes: SportSceneNode[];
};

type GetTeamData = {
  team: { users: UserNode[] } | null;
};

type GetTeamVars = {
  teamId: string;
};

export function useTeamEdit() {
  const { type, sports } = useParams() as { type: string; sports: string };
  const searchParams = useSearchParams();
  const router = useRouter();
  const apolloClient = useApolloClient();

  const [localSelectedMember, setLocalSelectedMember] = useState<StudentInformation[] | null>(null);
  const [searchName, setSearchName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const teamId = searchParams?.get("teamid")?.trim() ?? "";
  const hasTeamId = teamId.length > 0;

  const { data: userData, loading: usersLoading } = useQuery<GetUsersData>(GET_USERS);
  const { data: sportSceneData, loading: sportSceneLoading } =
    useQuery<GetSportSceneData>(GET_SPORTSCENE);
  const teamQueryOptions = hasTeamId
    ? { variables: { teamId } }
    : { skip: true };
  const { data: teamData, loading: teamLoading } = useQuery<GetTeamData, GetTeamVars>(
    GET_TEAM,
    teamQueryOptions,
  );

  const sportScene = useMemo(() => {
    return sportSceneData?.sportScenes?.find(
      (d) => d.sport.id === sports && d.scene.id === type,
    );
  }, [sportSceneData, sports, type]);

  const sportSceneId = sportScene?.id ?? "";
  const { data: sportSceneEntriesData, loading: sportSceneEntriesLoading } = useQuery<
    SportSceneEntriesData,
    SportSceneEntriesVars
  >(GET_SPORTSCENE_ENTRIES, sportSceneId ? { variables: { sportSceneId } } : { skip: true });
  const loading =
    usersLoading ||
    sportSceneLoading ||
    sportSceneEntriesLoading ||
    (hasTeamId && teamLoading);

  const teamMembersFromQuery = useMemo(() => {
    return (
      teamData?.team?.users?.map((u) => ({
        studentId: u.id,
        studentName: u.name,
      })) ?? []
    );
  }, [teamData?.team?.users]);

  const selectedMember = localSelectedMember ?? teamMembersFromQuery;
  const selectedIds = selectedMember.map((s) => s.studentId);
  const teamsInScene = sportSceneEntriesData?.sportScene?.entries?.map((d) => d.team);
  const teamCount = teamsInScene?.length ?? 0;

  const filteredUsers = useMemo(() => {
    if (!userData?.users) return [];
    return userData.users.filter((u) => {
      if (searchName === "") return true;
      return u.name.includes(searchName);
    });
  }, [userData?.users, searchName]);

  const myTeamUserIds = useMemo(() => {
    return teamMembersFromQuery.map((u) => u.studentId);
  }, [teamMembersFromQuery]);

  const alreadyInAnyTeam = useMemo(() => {
    const all = sportSceneEntriesData?.sportScene?.entries?.flatMap(
      (entry) => entry.team?.users ?? [],
    ) ?? [];
    return all.filter((user) => !myTeamUserIds.includes(user.id));
  }, [sportSceneEntriesData?.sportScene?.entries, myTeamUserIds]);

  const [addTeamMemberMutation] = useMutation(ADD_TEAM_MEMBER);
  const [createSportEntryMutation] = useMutation(CREATE_SPORT_ENTRY);
  const [createTeamMutation] = useMutation(CREATE_TEAM);
  const [deleteMemberMutation] = useMutation(DELETE_MEMBER);
  const [deleteTeamMutation] = useMutation(DELETE_TEAM);

  const addSelectedMember = (student: StudentInformation) => {
    setLocalSelectedMember((prev) => {
      const base = prev ?? teamMembersFromQuery;
      if (base.some((s) => s.studentId === student.studentId)) {
        return base;
      }
      return [...base, student];
    });
  };

  const createTeam = async () => {
    const { data } = await createTeamMutation({
      variables: {
        input: {
          name: `チーム${teamCount + 1}`,
        },
      },
    });
    return data?.createTeam?.id as string | undefined;
  };

  const addTeamMember = async (teamId: string, members: string[]) => {
    await addTeamMemberMutation({
      variables: {
        teamId,
        userIds: members,
      },
    });
  };

  const entryTeam = async (teamId: string, sportSceneIdValue: string) => {
    await createSportEntryMutation({
      variables: {
        input: {
          teamId,
          sportSceneId: sportSceneIdValue,
        },
      },
    });
  };

  const removeStudent = async (studentId: string) => {
    if (hasTeamId) {
      await deleteMemberMutation({
        variables: {
          teamId,
          userIds: [studentId],
        },
      });
    }

    setLocalSelectedMember((prev) => {
      const base = prev ?? teamMembersFromQuery;
      return base.filter((s) => s.studentId !== studentId);
    });
  };

  const submit = async () => {
    if (isSubmitting) return;

    let createdTeamId: string | undefined;
    setIsSubmitting(true);

    try {
      if (hasTeamId) {
        await addTeamMember(teamId, selectedIds);
      } else {
        if (!sportSceneId) return;
        const newTeamId = await createTeam();
        if (!newTeamId) return;
        createdTeamId = newTeamId;
        await addTeamMember(newTeamId, selectedIds);
        await entryTeam(newTeamId, sportSceneId);
      }
      await apolloClient.refetchQueries({
        include: ["GetSceneSport", "GetSportscene"],
      });
      apolloClient.cache.evict({ id: "ROOT_QUERY", fieldName: "sportScenes" });
      apolloClient.cache.evict({ id: "ROOT_QUERY", fieldName: "sportScene" });
      apolloClient.cache.gc();
      router.back();
    } catch (error) {
      if (createdTeamId) {
        try {
          await deleteTeamMutation({
            variables: {
              deleteTeamId: createdTeamId,
            },
          });
        } catch {
          // Rollback failed; keep original error path.
        }
      }
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
  };
}
