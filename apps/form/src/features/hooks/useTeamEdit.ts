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
  entries: { team: TeamNode }[];
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

  const teams = searchParams?.get("teamid");

  const { data: userData, loading } = useQuery<GetUsersData>(GET_USERS);
  const { data: sportSceneData } = useQuery<GetSportSceneData>(GET_SPORTSCENE);
  const { data: teamData } = useQuery<GetTeamData, GetTeamVars>(GET_TEAM, {
    variables: { teamId: teams ?? "" },
    skip: !teams,
  });

  const sportScene = useMemo(() => {
    return sportSceneData?.sportScenes?.find(
      (d) => d.sport.id === sports && d.scene.id === type,
    );
  }, [sportSceneData, sports, type]);

  const sportSceneMember = sportSceneData?.sportScenes?.filter(
    (d) => d.scene?.id === type,
  );

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
  const teamsInScene = sportScene?.entries?.map((d) => d.team);
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
    if (!sportSceneMember) return [];
    const all = sportSceneMember.flatMap((d) =>
      d.entries?.flatMap((s) => s.team?.users ?? []),
    );
    return all.filter((user) => !myTeamUserIds.includes(user.id));
  }, [sportSceneMember, myTeamUserIds]);

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
    if (teams) {
      await deleteMemberMutation({
        variables: {
          teamId: teams,
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
      if (teams) {
        await addTeamMember(teams, selectedIds);
      } else {
        if (!sportScene?.id) return;
        const newTeamId = await createTeam();
        if (!newTeamId) return;
        createdTeamId = newTeamId;
        await addTeamMember(newTeamId, selectedIds);
        await entryTeam(newTeamId, sportScene?.id);
      }
      await apolloClient.refetchQueries({
        include: ["GetSceneSport", "GetSportscene"],
      });
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
