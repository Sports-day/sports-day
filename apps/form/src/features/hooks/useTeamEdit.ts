import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useApolloClient } from "@apollo/client";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  useGetMeQuery,
  useGetUsersQuery,
  useGetSportsceneQuery,
  useGetSportsceneEntriesQuery,
  useGetTeamQuery,
  useGetSportExperienceQuery,
  useCreateTeamMutation,
  useAddTeamMemberMutation,
  useCreateSportEntryMutation,
  useDeleteMemberMutation,
  useDeleteTeamMutation,
  useAddSportExperiencesMutation,
  useDeleteSportExperiencesMutation,
  GetSportsceneDocument,
  GetSportsceneEntriesDocument,
  GetTeamDocument,
} from "@/gql/__generated__/graphql";
import { useMsGraphUsers } from "@/hooks/useMsGraphUsers";

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
  const [experiencedIds, setExperiencedIds] = useState<Set<string>>(new Set());
  const [experienceInitialized, setExperienceInitialized] = useState(false);
  const initialExperiencedIds = useRef<Set<string>>(new Set());

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
  const { data: experienceData, loading: experienceLoading } = useGetSportExperienceQuery({
    variables: { sportId: sports },
  });

  // Graph API でユーザー名を解決
  const userMsIds = useMemo(
    () => [
      ...(userData?.users ?? []).map((u) => u.identify?.microsoftUserId).filter((id): id is string => !!id),
      ...(teamData?.team?.users ?? []).map((u) => u.identify?.microsoftUserId).filter((id): id is string => !!id),
    ],
    [userData, teamData],
  );
  const { msGraphUsers, loading: msGraphLoading } = useMsGraphUsers(userMsIds);

  const resolveName = useCallback(
    (user: { name?: string | null; identify?: { microsoftUserId?: string | null } | null }) => {
      const msId = user.identify?.microsoftUserId;
      const msUser = msId ? msGraphUsers.get(msId) : undefined;
      return msUser?.displayName ?? user.name ?? '';
    },
    [msGraphUsers],
  );

  const experiencedLimit = experienceData?.sport?.experiencedLimit ?? null;

  // 既存の経験者データで初期化（一度だけ）
  useEffect(() => {
    if (experienceInitialized || !experienceData?.sportExperiences) return;
    const ids = new Set(experienceData.sportExperiences.map((e) => e.userId));
    setExperiencedIds(ids);
    initialExperiencedIds.current = new Set(ids);
    setExperienceInitialized(true);
  }, [experienceData, experienceInitialized]);

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
    experienceLoading ||
    msGraphLoading ||
    (hasTeamId && teamLoading);

  const groupId = meData?.me?.groups?.[0]?.id ?? "";

  const teamMembersFromQuery = useMemo(() => {
    return (
      teamData?.team?.users?.map((u) => ({
        studentId: u.id,
        studentName: resolveName(u),
      })) ?? []
    );
  }, [teamData?.team?.users, resolveName]);

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
      const displayName = resolveName(u);
      return displayName.includes(searchName);
    });
  }, [userData?.users, searchName, resolveName]);

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

  // 選択中メンバーのうち経験者の数
  const experiencedCount = useMemo(() => {
    return selectedIds.filter((id) => experiencedIds.has(id)).length;
  }, [selectedIds, experiencedIds]);

  const experienceLimitReached = experiencedLimit !== null && experiencedCount >= experiencedLimit;

  const toggleExperience = useCallback((userId: string) => {
    setExperiencedIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  }, []);

  const [addTeamMemberMutation] = useAddTeamMemberMutation();
  const [createSportEntryMutation] = useCreateSportEntryMutation();
  const [createTeamMutation] = useCreateTeamMutation();
  const [deleteMemberMutation] = useDeleteMemberMutation();
  const [deleteTeamMutation] = useDeleteTeamMutation();
  const [addSportExperiencesMutation] = useAddSportExperiencesMutation();
  const [deleteSportExperiencesMutation] = useDeleteSportExperiencesMutation();

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
    if (!groupId) throw new Error("グループに所属していません。管理者にグループの割り当てを依頼してください。");
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
    // 経験者リストからも除外
    setExperiencedIds((prev) => {
      const next = new Set(prev);
      next.delete(studentId);
      return next;
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

      // 経験者データを差分保存（自チームのメンバーのみ対象）
      const selectedSet = new Set(selectedIds);
      const currentExperienced = new Set(selectedIds.filter((id) => experiencedIds.has(id)));
      const toAdd = [...currentExperienced].filter((id) => !initialExperiencedIds.current.has(id));
      const toRemove = [...initialExperiencedIds.current].filter(
        (id) => selectedSet.has(id) && !currentExperienced.has(id),
      );

      if (toAdd.length > 0) {
        await addSportExperiencesMutation({
          variables: { sportId: sports, userIds: toAdd },
        });
      }
      if (toRemove.length > 0) {
        await deleteSportExperiencesMutation({
          variables: { sportId: sports, userIds: toRemove },
        });
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
      const message =
        error instanceof Error ? error.message : "送信に失敗しました。";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    loading,
    groupId,
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
    experiencedIds,
    toggleExperience,
    experiencedLimit,
    experienceLimitReached,
  };
}
