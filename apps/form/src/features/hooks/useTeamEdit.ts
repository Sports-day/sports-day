import { useMemo, useState } from "react";
import { useApolloClient } from "@apollo/client";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  useGetMeQuery,
  useGetUsersQuery,
  useGetSportsceneQuery,
  useGetSportsceneEntriesQuery,
  useGetTeamQuery,
  useCreateTeamMutation,
  useAddTeamMemberMutation,
  useCreateSportEntryMutation,
  useDeleteMemberMutation,
  useDeleteTeamMutation,
  GetSportsceneDocument,
  GetSportsceneEntriesDocument,
  GetTeamDocument,
} from "@/gql/__generated__/graphql";

export type StudentInformation = {
  studentId: string;
  studentName: string;
};

export function useTeamEdit() {
  const { type, sports } = useParams() as { type: string; sports: string };
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const apolloClient = useApolloClient();

  const [localSelectedMember, setLocalSelectedMember] = useState<StudentInformation[] | null>(null);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<Set<string>>(new Set());
  const [searchName, setSearchName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const teamId = searchParams?.get("teamid")?.trim() ?? "";
  const hasTeamId = teamId.length > 0;

  const { data: meData, loading: meLoading } = useGetMeQuery();
  const { data: userData, loading: usersLoading } = useGetUsersQuery();
  const { data: sportSceneData, loading: sportSceneLoading } = useGetSportsceneQuery();
  const { data: teamData, loading: teamLoading } = useGetTeamQuery(
    hasTeamId
      ? { variables: { teamId } }
      : { skip: true, variables: { teamId: "" } },
  );

  const sportScene = useMemo(() => {
    return sportSceneData?.scenes
      ?.filter((s) => !s.isDeleted)
      ?.flatMap((s) => s.sportScenes)
      ?.find((d) => d.sport.id === sports && d.scene.id === type);
  }, [sportSceneData, sports, type]);

  const sportSceneId = sportScene?.id ?? "";
  const { data: sportSceneEntriesData, loading: sportSceneEntriesLoading } =
    useGetSportsceneEntriesQuery();
  const loading =
    meLoading ||
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

  const selectedMember = useMemo(
    () => localSelectedMember ?? teamMembersFromQuery,
    [localSelectedMember, teamMembersFromQuery],
  );
  const selectedIds = useMemo(
    () => selectedMember.map((s) => s.studentId),
    [selectedMember],
  );
  const teamCount = useMemo(() => {
    const sc = sportSceneEntriesData?.scenes
      ?.filter((s) => !s.isDeleted)
      ?.flatMap((s) => s.sportScenes)
      ?.find((ss) => ss.id === sportSceneId);
    return sc?.entries?.length ?? 0;
  }, [sportSceneEntriesData, sportSceneId]);

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
    const myTeamUserIdSet = new Set(myTeamUserIds);
    const all = sportSceneData?.scenes
      ?.filter((s) => !s.isDeleted)
      ?.flatMap((s) => s.sportScenes)
      ?.filter((sportScene) => sportScene.scene.id === type)
      .flatMap((sportScene) =>
        sportScene.entries?.flatMap((entry) => entry.team?.users ?? []) ?? [],
      ) ?? [];
    return all.filter((user) => !myTeamUserIdSet.has(user.id));
  }, [myTeamUserIds, sportSceneData?.scenes, type]);

  const [addTeamMemberMutation] = useAddTeamMemberMutation();
  const [createSportEntryMutation] = useCreateSportEntryMutation();
  const [createTeamMutation] = useCreateTeamMutation();
  const [deleteMemberMutation] = useDeleteMemberMutation();
  const [deleteTeamMutation] = useDeleteTeamMutation();

  const addSelectedMember = (student: StudentInformation) => {
    setLocalSelectedMember((prev) => {
      const base = prev ?? teamMembersFromQuery;
      if (base.some((s) => s.studentId === student.studentId)) {
        return base;
      }
      return [...base, student];
    });
  };

  const createTeam = async (memberIds: string[]) => {
    const groupId = meData?.me?.groups?.[0]?.id;
    if (!groupId) throw new Error("グループ情報が取得できません");
    const { data } = await createTeamMutation({
      variables: {
        input: {
          name: `チーム${teamCount + 1}`,
          groupId,
          userIds: memberIds,
        },
      },
    });
    return data?.createTeam?.id as string | undefined;
  };

  const addTeamMember = async (targetTeamId: string, members: string[]) => {
    await addTeamMemberMutation({
      variables: {
        teamId: targetTeamId,
        userIds: members,
      },
    });
  };

  const entryTeam = async (targetTeamId: string, sportSceneIdValue: string) => {
    await createSportEntryMutation({
      variables: {
        sportSceneId: sportSceneIdValue,
        teamId: targetTeamId,
      },
    });
  };

  const removeStudent = (studentId: string) => {
    if (hasTeamId) {
      setPendingDeleteIds((prev) => new Set([...prev, studentId]));
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
    setSubmitError(null);

    try {
      if (hasTeamId) {
        if (pendingDeleteIds.size > 0) {
          await deleteMemberMutation({
            variables: {
              teamId,
              userIds: [...pendingDeleteIds],
            },
          });
        }
        const myTeamUserIdSet = new Set(myTeamUserIds);
        const newMemberIds = selectedIds.filter((id) => !myTeamUserIdSet.has(id));
        if (newMemberIds.length > 0) {
          await addTeamMember(teamId, newMemberIds);
        }
      } else {
        if (!sportSceneId) return;
        const newTeamId = await createTeam(selectedIds);
        if (!newTeamId) return;
        createdTeamId = newTeamId;
        await entryTeam(newTeamId, sportSceneId);
      }
      await apolloClient.refetchQueries({
        include: [
          GetSportsceneDocument,
          GetSportsceneEntriesDocument,
          GetTeamDocument,
          "GetSceneSport",
          "GetAllTeamdata",
        ],
      });
      navigate(-1);
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
      setSubmitError("送信に失敗しました。もう一度お試しください。");
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
    submitError,
  };
}
